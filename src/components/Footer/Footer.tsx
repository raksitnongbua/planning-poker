'use client'
import Link from 'next/link'
import React from 'react'

export interface FooterProps {
  // types...
}

const Footer: React.FC<FooterProps> = ({}) => {
  return (
    <footer className="border-t mt-auto py-6 px-4">
      <div className="container mx-auto flex flex-col items-center gap-3 text-center text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} Corgi Planning Poker</span>
        <div className="flex items-center gap-4">
          <Link href="/privacy-policy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <a
            href="mailto:tan.raksit@gmail.com"
            className="hover:text-foreground transition-colors"
          >
            Contact
          </a>
          <a
            href="https://github.com/raksitnongbua/planning-poker"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://github.com/raksitnongbua/planning-poker/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Open Issue
          </a>
          <a
            href="https://github.com/raksitnongbua/planning-poker/pulls"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Contribute
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
