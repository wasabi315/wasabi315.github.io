import React from "react"
import { graphql } from "gatsby"
import { IndexPageQuery } from "~/types/graphql-types"

type Props = {
  data: IndexPageQuery
}

const Index: React.FC<Props> = ({ data }) => (
  <div>
    <h1>Hi people</h1>
    <p>
      Welcome to my new <strong>{data.site?.siteMetadata?.title}</strong>
    </p>
    <p>Now go build something great.</p>
  </div>
)

export const pageQuery = graphql`
  query IndexPage {
    site {
      siteMetadata {
        title
      }
    }
  }
`

export default Index
