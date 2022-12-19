import Link from "next/link"
import Image from "next/image"
import { ReactNotifications } from "react-notifications-component"

function layout(props: any) {
  return (
    <>
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div id="navbar" className="navbar-menu">
          <div className="logo">
            <Image alt="logo" src="/bb-emblem.svg" width="50" height="50" />
          </div>
          <div className="navbar-start">
            <Link href="/">
              <a className="navbar-item">
                List
              </a>
            </Link>
            <Link href="/save">
              <a className="navbar-item">
                New sale
              </a>
            </Link>
          </div>
          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                <a className="button is-primary" href="https://budibase.readme.io/reference">
                  <strong>API Documentation</strong>
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <ReactNotifications />
      {props.children}
    </>
  )
}

export default layout