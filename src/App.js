import React, { useState } from 'react'
import { useQuery, gql, useLazyQuery,useMutation } from '@apollo/client';

const GETDATA = gql`
query GetData{
  allUsers {
    id
    name
    Posts{
      title
      views
      User{
        name
      }
    }
   
  }
}
`


const GETDATASINGLE = gql`
query ($id:ID!){
  User(id:$id) {
    Posts{
      title
      views
    }
  }
}
`

const ADDATA = gql`
mutation User($name:String!){
  createUser(name: $name){
    name:name
  }
}
`

const REMOVEUSER = gql `
mutation User($id:ID!){
  removeUser(id:$id){
    id:id
  }
}
`

const EDITUSER = gql `
mutation User($name:String!,$id:ID!){
  updateUser(name:$name,id:$id){
    name:name
    id:id
  }
}
`


function App() {
  const [name, setName] = useState('')
  const { loading, error, data,refetch } = useQuery(GETDATA);
  const [createUser,{data:response}] = useMutation(ADDATA);
  const [updateUser,{data:response3}] = useMutation(EDITUSER);
  const [removeUser,{data:response2}] = useMutation(REMOVEUSER);
  const [getData1, { data: get }] = useLazyQuery(GETDATASINGLE);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const handleClick = async(e) => {
    e.preventDefault()
    await createUser({variables:{name:name}}).then(()=>{
      refetch()
      setName('')
    }).catch((err)=>console.log(err)) 
  }



  return (
    <div className="">
      <h1>GRAPHQL</h1>
      <div>
        <h1>Add Data</h1>
        <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={handleClick}>Add User</button>
        <button onClick={()=>updateUser({variables:{name:name,id:456}})}>Edit User</button>
      </div>


      <div>
        {
          data.allUsers.map((da) => {
            return (
              <>
                {da.name}
                <button onClick={() => getData1({ variables: { id: da.id } })}>View</button>
                <button onClick={()=>{
                  removeUser({ variables: { id: da.id } })
                  refetch()
                }}>Delete</button>
              </>
            )
          })
        }
      </div>
      <div>Detail</div>
      <div>
        {
          get?.User?.Posts?.map((d) => {
            return (
              <>
                <p>{d?.title}</p>
                <p>{d?.views}</p>
              </>
            )
          })
        }
      </div>

    </div>
  );
}

export default App;
