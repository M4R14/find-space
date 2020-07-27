import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Img from "gatsby-image"
import SEO from "../components/seo"
import Search from "../components/Search"

const IndexPage = ({ data }) => {
  console.log(data.allMangasJson.edges)
  return (
    <Layout>
      <SEO title="Home" />
      <h1>Hi people</h1>
      {/* <p>Welcome to your new Gatsby site.</p>
      <p>Now go build something great.</p>
      <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
        <Image />
      </div> */}
      <Search></Search>
      <div className="manga-list">
        { data.allMangasJson.edges.map(({ node }) => 
            <Link className="manga-item" to={node.fields.slug}>
              {
                node.cover && (
                  node.cover.childImageSharp && (
                    <Img
                      key={node.cover.name}
                      fluid={node.cover.childImageSharp.fluid}
                      objectFit="cover"
                      objectPosition="50% 50%"
                      alt={node.cover.name}
                    />
                  )
                )
              }
              <div className="manga-item-detail">
                {node.title}
              </div>
            </Link>
          ) 
        }
      </div>
      
      <Link to="/page-2/">Go to page 2</Link> <br />
      <Link to="/using-typescript/">Go to "Using TypeScript"</Link>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  query {
    allMangasJson {
      edges {
        node {
          title
          cover {
            childImageSharp {
              fluid {
                ...GatsbyImageSharpFluid
              }
            }
          }
          fields {
            slug
          }
        }
      }
    }
  }
`
