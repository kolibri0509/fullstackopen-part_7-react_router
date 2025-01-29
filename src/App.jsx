import { useState } from 'react'
import { useField } from './hooks'
import {
  Routes, Route, Link, 
  useNavigate, useMatch
} from 'react-router-dom'
import { Table, Form, Button, Alert, Navbar, Nav } from 'react-bootstrap'

const AnecdoteList = ({ anecdotes }) => {
  return(
  <div>
    <h2>Anecdotes</h2>
    <Table striped>
      <tbody>
        {anecdotes.map(anecdote => {
          console.log(anecdote.content)
          return(
          <tr key={anecdote.id}>
            <td><Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link></td>
          </tr>)}
          )
        }
      </tbody>
    </Table>
  </div>
 )
}
const Anecdote = ({ anecdote }) => {
  const margin = {
    marginBottom : 10
  }

  return (
    <>
      <h2>{anecdote.content}</h2>
      <div style={margin}>has {anecdote.votes} votes</div>
      <div style={margin}>for more info see <a href='{anecdote.info}'>{anecdote.info}</a></div>
    </>
  )
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is &quot;a story with a point.&quot;</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const CreateNew = (props) => {

  const text = useField('text')
  const author = useField('author')
  const info = useField('info')

  const navigate = useNavigate()

  const inputReset = (e) => {
    e.preventDefault()
    text.reset()
    author.reset()
    info.reset()
  }
 
  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content: text.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
    navigate('/')
    props.setNotification(`a new anecdote "${text.value}" created!`)
    setTimeout(() => {
      props.setNotification('')
    }, 5000)
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>content</Form.Label>
          <Form.Control
          value={text.value} 
          type={text.type}
          onChange={text.onChange}/>
        </Form.Group>
        <Form.Group>
          <Form.Label>author</Form.Label>
          <Form.Control
          value={author.value} 
          type={author.type}
          onChange={author.onChange}/>
        </Form.Group>
        <Form.Group>
          <Form.Label>url for more info</Form.Label>
          <Form.Control
          value={info.value} 
          type={info.type}
          onChange={info.onChange}/>
        </Form.Group>
        <Button type='submit'>create</Button>
        <Button type='button' onClick={inputReset}>reset</Button>
      </Form>
    </div>
  )
}

const App = () => {
  
  const padding = {
    padding: 5
  }
  // const color = {
  //   color: 'red'
  // }

  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const match = useMatch('/anecdotes/:id')
  const anecdote = match 
    ? anecdotes.find(anecdote => anecdote.id === Number(match.params.id))
    : null

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
  }

  // const anecdoteById = (id) =>
  //   anecdotes.find(a => a.id === id)

  // const vote = (id) => {
  //   const anecdote = anecdoteById(id)

  //   const voted = {
  //     ...anecdote,
  //     votes: anecdote.votes + 1
  //   }

  //   setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  // }

  return (
    <div className="container">
      <h1>Software anecdotes</h1>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#" as="span">
              <Link to="/" style={padding}>anecdotes</Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link to="/create" style={padding}>create new</Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link to="/about" style={padding}>about</Link>
            </Nav.Link>            
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {(notification)&&<Alert variant="success">{notification}</Alert>}      
      <Routes>
        <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />}></Route>
        <Route path="/about" element={<About/>}></Route>
        <Route path="/create" element={<CreateNew addNew={addNew} setNotification={setNotification}/>}></Route>
        <Route path="/anecdotes/:id" element={<Anecdote anecdote={anecdote}></Anecdote>}></Route>
      </Routes>
        <Footer />
    </div>
  )
}

export default App
