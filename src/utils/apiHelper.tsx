interface Options{
    method:"GET"|"PUT"|"DELETE"|"PATCH"|"POST",
    headers?:Record<string,string>,
    data?:any
}
const apiHelper=async(url:string,options:Options)=>{
try {
    const headers:Record<string,string>={
    ...(options.headers?options.headers:{})
}
const response=await fetch(url,{
    method:options.method,
    headers,
    body:JSON.stringify(options.data)
})

const res=await response.json()
if(res.status==200) return res.data
throw new Error(res.message||"API error")

} catch (error) {
    throw error
}
}
export default apiHelper