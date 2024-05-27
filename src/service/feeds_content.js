import { createContext, useState } from "react";
import axios from "axios"
import Cookies from 'js-cookie';



export const feeds_context = createContext(null)



const FeedProvider = ({children}) => {
  const [ feed, set_feed ] = useState(null)
  
  const [ modal, setModal ] = useState(false)
  
  const [ feed_id, set_feed_id ] = useState(null)
  const [feed_error, set_feed_error] = useState(null)

  const [ email, set_email ] = useState({
    body: "", 
    subject: "",
    recipient:""
  })

  const [send, set_send] = useState("send")

  
  const [ search, set_search ] = useState("")

  const [not_found, set_not_found] = useState(false)
  
    const get_all_feeds = async()=>{
       try {
         const response = await axios.get("https://nss-project-backend.onrender.com/api/v1/document-route/get-all-files")
        const data = response.data.msg?.reverse()
        console.log(data)
        set_feed(data)
       } catch (error) {
        set_feed_error(error?.response?.data.msg || error?.response?.data.errors || error.message)
       }
    }

  const modal_control = (id, file_name )=>{
    setModal(!modal)
    set_feed_id(id)
    localStorage.setItem("file_name", file_name )
  }

  const get_message = (e)=>{
    set_email({ ...email, [ e.target.name ]: e.target.value })
  }
  
 
  const post_message = async()=>{
    const file_name = localStorage.getItem("file_name")
    
    const body = {
      subject: email.subject,
      body: email.body,
      recipient: email.recipient,
      file_name 
    }
    try {
      set_send("sending...")
      const user_token = Cookies.get("user_token")
                                        
      const response = await axios.post(`https://nss-project-backend.onrender.com/api/v1/message-route/send-message/${feed_id}/`, body, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${user_token}`,
        }
      })
      set_send("send")

      if (response.status === 200) {
        setModal(!modal)
        set_email({body:"", subject:"", recipient:""})
      }
    } catch (error) {
      set_send("send")
      set_feed_error(error?.response?.data.msg || error?.response?.data.errors || error.message)
       const timer = setInterval(()=>{
            set_feed_error(null)
          }, [2000])

          setTimeout(() => {
            clearInterval(timer)
          }, 2000);
    }
  }

  const post_download = async(feed_id, file)=>{
    try {
       const user_token = Cookies.get("user_token")
      const response = await axios.get(`https://nss-project-backend.onrender.com/api/v1/download-route/download-file/${feed_id}/${file}/`,  {
                responseType: 'blob', // Important for handling file downloads
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${user_token}`,
        }
              
            })
    
      // Create a URL for the file blob
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // Create a link element
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file); // Set the file name

        // Append the link to the body
        document.body.appendChild(link);

        // Programmatically click the link to trigger the download
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);

        console.log("File download triggered");
    } catch (error) {
      set_feed_error(error?.response?.data.msg || error?.response?.data.errors || error.message)
      const timer = setInterval(()=>{
            set_feed_error(null)
          }, [2000])

          setTimeout(() => {
            clearInterval(timer)
          }, 2000);
    }
  }
  
  const search_value = (e)=>{
    set_search(e.target.value)
    if (e.target.value === "") {
      get_all_feeds()
    }
  }
  const search_feed = async ()=>{
    try {
      if (search !== "") {
        const user_token = Cookies.get("user_token")
        const response = await axios.get(`https://nss-project-backend.onrender.com/api/v1/document-route/search-file?search=${search}`, {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${user_token}`,
          }
        })
      const data = await response.data
        if (data?.msg !== "No files found") {
          set_feed(data?.msg)
        } else {
          set_not_found(true)
          const timer = setInterval(()=>{
            set_not_found(false)
          }, [2000])

          setTimeout(() => {
            clearInterval(timer)
          }, 2000);
        }
      }
    } catch (error) {
      set_feed_error(error?.response?.data.msg || error?.response?.data.errors || error.message)
       const timer = setInterval(()=>{
            set_feed_error(null)
          }, [2000])

          setTimeout(() => {
            clearInterval(timer)
          }, 2000);
    }
  }
  return (
    <feeds_context.Provider value={{
      feed, get_all_feeds,
      modal,
      setModal,
      modal_control,
      post_message,
      get_message,
      post_download,
      search_value,
      search,
      search_feed,
      not_found, 
      feed_error,
      send
    }}>
      {children}
    </feeds_context.Provider>
  )
}

export default FeedProvider
