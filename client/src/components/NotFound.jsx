const style = {
  height : 'calc(100vh - 164px)',
  display : 'flex',
  alignItems : 'center',
  justifyContent : 'center'
}
function NotFound() {
  return (
    <div style={style}>
       <h2 style={{color: 'tomato'}}>Page doesn't exist</h2>
    </div>
  )
}

export default NotFound

