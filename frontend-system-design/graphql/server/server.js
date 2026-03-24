const {gql, ApolloServer} = require('apollo-server');

const user = [
    {
        id: 0,
        name: 'JS Cafe',
        problems: [0,1]
    },
    {
        id: 1,
        name: 'Roadside Coder',
        problems: [1,2]
    }
]

const problem = [
    {
        id: 0,
        name: 'Two Sum',
        difficulty: 'Easy'
    },
    {
        id: 1,
        name: 'Add Two Numbers',
        difficulty: 'Medium'
    },
    {
        id: 2,
        name: 'Longest Substring Without Repeating Characters',
        difficulty: 'Hard'
    }
]

const typeDefs = gql`
    type User {
        id: ID!
        name: String!
        problems: [Problem]
    }

    type Problem {
        id: ID!
        name: String!
        solvers: [User]
    }

    type Query {
        users: [User]
        problems: [Problem]
    }
`

const resolvers = {
    Query: {
        users: () => user,
        problems: () => problem
    },
    User: {
        problems(parent) {
            return parent.problems.map(problemId => problem.find(p => p.id === problemId))
        }
    },
    Problem: {
        solvers(parent) {
            return parent.solvers.map(userId => user.find(u => u.id === userId))
        }
    }
}

const server = new ApolloServer({typeDefs, resolvers});

server.listen(4000).then(({url}) => {
    console.log(`Server ready at ${url}`);
})