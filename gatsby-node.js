/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const path = require(`path`)

const { createFilePath } = require(`gatsby-source-filesystem`)
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  // if (node.sourceInstanceName === `mangas`) {
  //   console.log('mangas', node.internal.type)
  //   createNodeField({
  //     node,
  //     name: `slug`,
  //     value: slug,
  //   })
  // }
  
  if (node.internal.type === `MangasJson`) {
    const slug = createFilePath({ node, getNode, basePath: `pages/manga` })
    // console.log(node)
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}
exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions
  const typeDefs = `
    type MangasJson implements Node {
      id: ID!
    }
  `
  createTypes(typeDefs)
  createTypes([
    schema.buildObjectType({
      name: `MangasJson`,
      fields: {
        cover: {
          type: "File",
          resolve(source, args, context, info) {
            const files = context.nodeModel.getAllNodes({ type: `File` })
              .filter(file => file.relativeDirectory == source.pages)
              .filter(file => file.extension !== 'json' )
              .sort((a,b) => a.name - b.name)
              
            return files[0]
          }
        },
        pagex: {
          type: [`File`],
          resolve(source, args, context, info) {
            return context.nodeModel.getAllNodes({ type: `File` })
              .filter(file => file.relativeDirectory == source.pages)
              .sort((a,b) => a.name - b.name)
          }
        }
      }
    })
  ])
};

// exports.createResolvers = ({ createResolvers }) => {
//   createResolvers({
//     MangasJson: {
//       Pagex: {
//         type: [`File`],
//         resolve(source, args, context, info) {
//           const Files = context.nodeModel.getAllNodes({
//             type: `File`,
//           })
//           return Files
//         }
//       }
//     }
//   })
// };

// exports.createSchemaCustomization = ({ actions, schema }) => {
//   const { createTypes } = actions
//   const typeDefs = [
//     `type MangasJson implements Node {
//       cover: File @link
//     }`,
//     schema.buildObjectType({
//       name: "MangasJson",
//       fields: {
//         images: {
//           type: "File",
//           resolve: (source, args, context, info) => {
//             // return context.nodeModel.getNodeById({
//             //   id: source.author,
//             //   type: "AuthorJson",
//             // })
//             return context.nodeModel
//               .getAllNodes({ type: "File" })
//               // .find(author => author.email === source.author)
//           },
//         },
//       },
//     }),
//   ]
//   createTypes(typeDefs)
// }

exports.createPages = async ({ graphql, actions }) => {
  // **Note:** The graphql function call returns a Promise
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise for more info
  const { createPage } = actions
  const result = await graphql(`
    query {
      allMangasJson {
        edges {
          node {
            pages
            fields {
              slug
            }
          }
        }
      }
    }
  `)
  result.data.allMangasJson.edges.forEach(({ node }) => {
    // console.log("allMangasJson", node)
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/manga.jsx`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        pages: node.pages,
        slug: node.fields.slug,
      },
    })
  })
  // console.log(JSON.stringify(result, null, 4))
}


// exports.sourceNodes = async ({
//     actions,
//     createNodeId,
//     createContentDigest,
//   }) => {
//     const { createNode } = actions
  
//     const GOOGLE_API_KEY = "dfc4881248b6dc25a33f3a3e8477b68ec90fe34e";
//     const GOOGLE_SHEET_ID = "1s9li_UT78LYmVhj6qEZ4N__YboymGVvgjMpRoJ7EoU4";
//     const fetchFormItems = () =>
//       axios.get(
//         `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values:batchGet`,
//         {
//             params: {
//                 ranges: 'export',
//                 majorDimension: 'ROWS',
//                 key: GOOGLE_API_KEY
//             }
//         }
//       )
  
//     const response = await fetchFormItems()
  
//     const arrayOfItems = response.data.valueRanges[0].values
  
//     let rows = []
//     for (var i = 1; i < arrayOfItems.length; i++) {
//       var rowObject = {}
//       for (var j = 0; j < arrayOfItems[i].length; j++) {
//         rowObject[arrayOfItems[0][j]] = arrayOfItems[i][j]
//       }
//       rows.push(rowObject)
//     }
  
//     let itemsArrayWithTagsArray = rows.map(function(item) {
//       item.tags = item.tags.split(",").map(item => item.trim())
//       item = { ...item }
//       return item
//     })
  
//     itemsArrayWithTagsArray.map((item, i) => {
//       const itemNode = {
//         id: createNodeId(`${i}`),
//         parent: `__SOURCE__`,
//         internal: {
//           type: `item`, // name of the graphQL query --> allItem {}
//           contentDigest: createContentDigest(item),
//         },
//         children: [],
//         move: item.move,
//         videoUrl: item.videoUrl,
//         thumbnail: item.thumbnail,
//         title: item.title,
//         tags: item.tags,
//         level: item.level,
//         instructor: item.instructor,
//         instructor_image: item.instructor_image,
//       }
  
//       createNode(itemNode)
//     })
//   }

