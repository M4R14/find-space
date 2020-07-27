import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Img from "gatsby-image"

// import MangaPages from "../components/MangaPages"

export default function BlogPost({ data }) {
    const post = data.mangasJson
    return (
      <Layout>
        <div>
            <h1>{post.title}</h1>
            <div className="page-list">
              { 
                post.pagex.sort((a,b) => a.name - b.name)
                  .filter(({ childImageSharp }) => childImageSharp != null)
                  .map(({ name, childImageSharp }) => (
                    <Img 
                      key={name}
                      fluid={childImageSharp.fluid}
                      objectFit="cover"
                      objectPosition="50% 50%"
                      alt={name}
                    />
                  )) 
              }
            </div>
        </div>
      </Layout>
    )
}

export const query = graphql`
  query( $slug: String! ) {
    mangasJson (fields: { slug: { eq: $slug } }) {
      title
      pagex {
        name
        childImageSharp {
          fluid {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  }
`