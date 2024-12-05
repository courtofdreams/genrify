"use client";

import Login from "./login/page";
import Playlist from "./playlist/page";

export default function Home() {

  const render = ()=>{
    const accessToken = localStorage.getItem('access_token');
    console.log(accessToken);
    if(accessToken  && accessToken !== ''){
      return <Playlist />;
    }else {
      return <Login />
    }
  }

  return render();
}
