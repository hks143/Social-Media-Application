import React from 'react'
import { Button ,Typography} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
const PageNotFound = () => {
  const history=useHistory();
  const f=()=>{
      history.push('/');
  }
  return (
       <>
       <div>
       <Typography   variant="h2">404 Page Not Found 😕</Typography>
       <Button onClick={f} variant="contained" color="secondary">Go to Home</Button>
       </div>
        
       </>
  )
}

export default PageNotFound
