import React, { JSX } from 'react'

export default function Profile(): JSX.Element {
  const isDataFetching = false
  return (
    <div>
      {isDataFetching ? <div>profile page</div> : <div>loading profile page</div>}
    </div>
  )
}
