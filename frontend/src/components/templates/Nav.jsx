import React from "react"
import Link from "./Link"
import './Nav.css'

export default props => 
    <aside className="menu-area">
        <nav className="menu">
            <Link location="/" icon="home" content="Início"/>
            <Link location="/users" icon="users" content="Usuários"/>
        </nav>
    </aside>