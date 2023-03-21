const style = {
    height : 'calc(100vh - 164px)',
    display : 'flex',
    alignItems : 'center',
    justifyContent : 'center'
}
function UserNotFound() {
    return (
        <div style={style}>
            <h2 style={{color: 'tomato'}}>user not found</h2>
        </div>
    )
}

export default UserNotFound
