import React, { useEffect, useState, useCallback } from "react";
import { API, graphqlOperation, Auth, Amplify } from "aws-amplify";
import psl from 'psl'
import { GraphQLResult } from '@aws-amplify/api'

import { Post } from "../../models";
import { createPost } from "../../graphql/mutations";
import { ListPostsByTimeQuery, ModelSortDirection, ListPostsByChannelQuery } from "../../API";
import { listPostsByTime, listPostsByChannel, } from '../../graphql/queries';

import { UtilityContext, Utility, useUtility } from "../Utility";
import photo from '../../assets/photo.png'
import styles from './App.module.css'

// Get Posthog Event Analytics
// https://posthog.com
// @ts-ignore
import posthog from 'posthog-js';

// Uncomment me during set up to create your user
// import { withAuthenticator } from '@aws-amplify/ui-react'
// --------------

function extractHostname(target_url: string) {
  var hostname
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (target_url.indexOf('//') > -1) {
    hostname = target_url.split('/')[2]
  }
  else {
    hostname = target_url.split('/')[0]
  }

  //find & remove port number
  hostname = hostname.split(':')[0]
  //find & remove '?'
  hostname = hostname.split('?')[0]

  return hostname
}

interface ChannelMap {
  [x: string]: string
}
const CHANNEL_NAME_MAP: ChannelMap = {
  'njEKszjwbeX4ZroWlhbE': 'Some Channel Name',
  'JvboU0Adth7Q6yuLHcbv': 'Second Channel Name',
  '7ExtTHreafiHC4mGl3h1': 'Private Personal',
  'ImPy7KgHIhs7glpv2gUm': 'Private Work',
  // 'Pk181Y7ja0ArK9VVWGhC': '',
  // 'dxnN5aUV6QEZTawp8y3H': '',
  // 'pS2tGkEUEgisBP3U0AjY': '',
  // '70Uzs5qL1LNkwNJBjEbR': '', 
  // 'r7XXKChPM1tXE9V8Piud': '', 
  // 'NDh2qO4TiqkYkCmUt6I0': '', 
  // 'ogRudBB5KfMEmMeX4ZdE': '', 
  // 'GzGdEDKtzmC7MZM4XQc2': '', 
  // 'CjBnhXxixGJmXsEczJQT': '', 
  // 'IK5LXUMOSNj7ae4Ap3Ut': '',
  // 'zVz3MjzOGdeZ5rJML9OX': '', 
  // 'YmsAT7yNazsB2w0mj8wD': '', 
  // 'kEfxmLEDQ2c8g4vlGIgb': '', 
  // 'Y4pbzS4756NLKejZSayU': '', 
  // 'aJQoilmi8A5Mx8R7QJxO': '', 
  // 'EgInSEq02qpH2wqw7U3g': '',
  //'JX0ZFeEGHxseZ5sFxQZS': '',
  // 'gzMoxiNxap9hueEmmbfY': '',
  // 'LJDMpgh7sYxu7Ddg8O2H': '',
}

// Add Channel Codes here if you want them to be filtered out and made invisible to the public--then only you can add links / view them.
// Note that this done client-side which is always a no-no--if someone REALLY wanted to they could edit the client-side code and see that channel.
const SECRET_CHANNELS = [
  '7ExtTHreafiHC4mGl3h1', // Private Personal
  'ImPy7KgHIhs7glpv2gUm', // Private Work
]

const INIT_TIME = { start: Date.now() / 1000, end: Date.now() / 1000 }
const App = () => {
  const utility = useUtility()

  // Inputs
  const [timeBorders, setTimeBorders] = useState(INIT_TIME)
  const [pageNum, setPageNum] = useState(0)
  const [chosenChannelCode, setChosenChannelCode] = useState('')


  // Data
  const [posts, setPosts] = useState<Array<Post>>([]);
  const [error, setError] = useState(false)
  const [multiplePagesAvailable, setMultiplePagesAvailable] = useState(false)


  // UI
  const [choseAuthMode, setChoseAuthMode] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [firstLoadDone, setFirstLoadDone] = useState(false)
  const [loading, setLoading] = useState(true)
  const [noMorePosts, setNoMorePosts] = useState(false)


  // Check Auth
  useEffect(() => {
    // Replace this string with your email 
    const emailString = 'yourEmailHere@me.com'
    const getUser = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser()
        if (user.attributes.email === emailString) {
          try {
            posthog.identify('Me')
            posthog.opt_out_capturing();
          } catch (error) {
            console.log(error)
          }
          Amplify.configure({
            "aws_appsync_authenticationType": "AMAZON_COGNITO_USER_POOLS",
          });
          setShowAdd(true)
        }
      } catch (error) {
        console.log(error)
      }
      setChoseAuthMode(true)
    }
    getUser()
  }, [])

  const fetchPosts = useCallback(async (getEarlier: boolean, channelCode: string) => {
    setLoading(true)
    const ITEMS_TO_LOAD = 12

    try {
      const timeBounds = getEarlier ? { lt: timeBorders.start } : { gt: timeBorders.end }
      const sortDirection = getEarlier ? ModelSortDirection.DESC : ModelSortDirection.ASC
      let newPosts = []
      if (channelCode) {
        const postData = await API.graphql(graphqlOperation(listPostsByChannel, { channelCode, time: timeBounds, sortDirection, limit: ITEMS_TO_LOAD })) as GraphQLResult<ListPostsByChannelQuery>
        newPosts = postData.data?.listPostsByChannel?.items as Array<Post>;
        if (!postData.data?.listPostsByChannel?.nextToken && getEarlier) {
          setNoMorePosts(true)
        } else {
          setNoMorePosts(false)
          setMultiplePagesAvailable(true)
        }
      } else {
        const postData = await API.graphql(graphqlOperation(listPostsByTime, { type: "link", time: timeBounds, sortDirection, limit: ITEMS_TO_LOAD })) as GraphQLResult<ListPostsByTimeQuery>
        newPosts = postData.data?.listPostsByTime?.items as Array<Post>;
        if (!postData.data?.listPostsByTime?.nextToken && getEarlier) {
          setNoMorePosts(true)
        } else {
          setNoMorePosts(false)
        }
      }
      if (newPosts.length) {
        // Set Time Bounds
        if (!getEarlier) {
          // Since we're looking for later posts but retrieved them in ascending time, reverse
          newPosts.reverse()
        }
        const earliestTime = newPosts[newPosts.length - 1].time as number
        const latestTime = newPosts[0].time as number
        const newBorders = { start: earliestTime, end: latestTime }
        setTimeBorders(newBorders)
        setPosts(newPosts);
      } else {
        const newBorders = { start: 0, end: timeBorders.start - .5 }
        setTimeBorders(newBorders)
        console.log('No posts')
      }
    } catch (err) {
      console.log(err)
      console.log("error fetching posts");
      setError(true)
    }
    setLoading(false)
  }, [timeBorders])

  // First Load
  useEffect(() => {
    if (firstLoadDone || !choseAuthMode) {
      return
    }
    setFirstLoadDone(true)
    fetchPosts(true, chosenChannelCode)
  }, [fetchPosts, firstLoadDone, choseAuthMode, chosenChannelCode]);


  // Render the posts
  const renderPosts = posts.map((post, index) => {
    const { id, url, title, caption } = post
    const time = (post.time as number) * 1000
    const channelCode = post.channelCode as string

    if ((SECRET_CHANNELS.includes(channelCode) && !showAdd)
      || !url) {
      return null
    }

    const domainName = psl.get(extractHostname(url))

    const chooseChannelCode = () => {
      setPosts([])
      setPageNum(0)
      setTimeBorders(INIT_TIME)
      setFirstLoadDone(false)
      setChosenChannelCode(channelCode)
      setNoMorePosts(false)
    }

    return (
      < div key={id ? id : index} className={styles.post} >
        <p><a href={url} target="_blank" rel="noopener noreferrer">{title ? title : url}</a><span className="colorGray">&nbsp;&nbsp;&nbsp;({domainName})</span></p>
        {caption &&
          <p className={styles.caption}><img alt="brian-pic" src={photo} className={styles.brianImg} />{caption}</p>
        }
        <p className="colorGray">{utility.getTimeText(time)}&nbsp;&nbsp;-&nbsp;&nbsp;<span onClick={chooseChannelCode} className={styles.channelCode}>{CHANNEL_NAME_MAP[channelCode]}</span></p>
      </div >
    )
  })

  const loadNextPage = (getEarlier: boolean) => () => {
    setPosts([])
    setPageNum(prev => getEarlier ? prev + 1 : prev - 1)
    fetchPosts(getEarlier, chosenChannelCode)
  }

  const cancelChosenChannel = () => {
    setChosenChannelCode('')
    setPosts([])
    setPageNum(0)
    setTimeBorders(INIT_TIME)
    setFirstLoadDone(false)
    setNoMorePosts(false)
  }

  return (
    <>
      {showAdd && <AddPostComponent />}
      {chosenChannelCode && <p className={[styles.chosenChannelLabel,].join(' ')}>
        <span className="colorGray">Viewing Tag:</span>
        <span>&nbsp;&nbsp;{CHANNEL_NAME_MAP[chosenChannelCode]}</span>
        <span className={[styles.cancelChannelFilter, "colorGray"].join(' ')} onClick={cancelChosenChannel}>&times;</span></p>}
      {loading && <p className={"colorGray"}>Loading...</p>}
      {renderPosts}
      {!loading &&
        <div>
          {posts.length === 0 &&
            <div className={styles.noPosts}>
              <p className="colorGray">No more posts</p>
            </div>
          }
          <div className={styles.nav}>
            {pageNum > 0 && <button className="actionButton actionButtonHover" onClick={loadNextPage(false)}>Prev</button>}
            {multiplePagesAvailable && <span className={["colorGray", styles.pageNum].join(' ')}>{pageNum + 1}</span>}
            {!noMorePosts && <button className="actionButton actionButtonHover" onClick={loadNextPage(true)}>Next</button>}
          </div>
          <p className={[styles.src, "colorGray"].join(' ')}>Get a link feed like this for your own static site. It's <a target="_blank" rel="noopener noreferrer" href="https://github.com/brianjychan/linkfeed">open source</a></p>
          {showLogin && <SignInComponent />}
          <p onClick={() => { setShowLogin(true) }} className={[styles.login, "colorGray"].join(' ')}>© 2020</p>
        </div>
      }
      {error && <p>Looks like something broke. Please send me a message!</p>}
    </ >
  );
};

const SignInComponent: React.FC = () => {
  const [inputs, setInputs] = useState({ email: '', pw: '' })
  const [error, setError] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setInputs(prev => ({ ...prev, [name]: value }))
  }

  const doSignIn = async () => {
    try {
      Auth.signIn(inputs.email, inputs.pw)
    } catch (error) {
      console.log(error)
      setError(true)
    }
  }

  const { email, pw } = inputs
  return (
    <div>
      <p>email</p>
      <input onChange={handleChange} name="email" value={email} autoComplete="email" />
      <p>pw</p>
      <input onChange={handleChange} name="pw" value={pw} autoComplete="password" type="password" />
      <button onClick={doSignIn}>Sign in</button>
      {error && <p>Error signing in</p>}
    </div>
  )
}

const AddPostComponent: React.FC = () => {
  const [inputs, setInputs] = useState({ url: '', caption: '' })
  const [busy, setBusy] = useState(false)

  // Handle text input for adding a new post
  const handleAdd = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target
    setInputs(prev => ({ ...prev, [name]: value }))
  }

  const uploadToChannel = (channelCode: string) => async () => {
    const { url, caption } = inputs
    if (!url) {
      return
    }
    setBusy(true)
    try {
      const seconds = Math.trunc(Date.now() / 1000)
      const newPostData: Post = {
        url,
        caption,
        channelCode,
        type: 'link',
        time: seconds,

        id: '',

        title: '',
        imgUrl: '',
        desc: '',
      }
      await API.graphql(graphqlOperation(createPost, { input: newPostData }))
      setInputs({ url: '', caption: '' })
    } catch (error) {
      console.log(error)
    }


    setBusy(false)
  }

  const sortFunction = (channelCode: string, channelCodeTwo: string) => {
    const name1 = CHANNEL_NAME_MAP[channelCode]
    const name2 = CHANNEL_NAME_MAP[channelCodeTwo]
    if (name1 < name2) {
      return -1
    } else {
      return 1
    }
  }

  const { url, caption } = inputs
  // Render Channel Buttons
  const renderedChannels = Object.keys(CHANNEL_NAME_MAP).sort(sortFunction).map(channelCode => {
    const channelName = CHANNEL_NAME_MAP[channelCode]
    const colorStyle = url ? '' : 'colorGray'
    const addPointerStyle = url ? styles.pointer : ''

    const spanStyle = [colorStyle, addPointerStyle].join(' ')

    return (
      <div key={channelCode} className={styles.channelSelection} onClick={uploadToChannel(channelCode)}>
        <span className={spanStyle}>{channelName}</span>
      </div>
    )
  })
  return (
    <div className={styles.addPostArea}>
      <p>New Post</p>
      <input className={styles.addBox} onChange={handleAdd} value={url} name={"url"} placeholder="url" />
      <input className={styles.addBox} onChange={handleAdd} value={caption} name={"caption"} placeholder="caption" />
      <div>
        {url && ((busy) ? <p>Uploading...</p> : renderedChannels)}
      </div>
    </div>
  )
}

const AppWithProviders: React.FC = () => {
  const [posthogLoaded, setPosthogLoaded] = useState<any>(false)

  // Check out posthog: https://posthog.com
  useEffect(() => {
    const initPosthog = async () => {
      // @ts-ignore
      // await posthog.init("", { api_host: '' })

      setPosthogLoaded(true)
    }
    initPosthog()
  }, [])

  return (
    <UtilityContext.Provider value={new Utility()}>
      <div className={styles.view}>
        <div className={styles.title}>
          <h2>Links</h2>
          <p className="colorGray">A real-time feed of links I thought worth saving or sharing </p>
        </div>
        {posthogLoaded && <App />}
      </div>
    </UtilityContext.Provider>
  )
}

// Use this during setup so you can create an account:
// const AppWithSignUp = withAuthenticator(AppWithProviders)
// export default AppWithSignUp

// Use this in prod:
export default AppWithProviders;
