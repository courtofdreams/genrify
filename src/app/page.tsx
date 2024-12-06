"use client";

import Login from "./login/page";
import Playlist from "./playlist/page";

export default function Home() {

  const render = () => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken && accessToken !== '') {
        return <Playlist />;
      } else {
        return <Login />
      }
    }else{
      return <Login />
    }
  }

  return render();
}
