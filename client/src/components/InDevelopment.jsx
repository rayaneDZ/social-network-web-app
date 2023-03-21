const style = {
    height : 'calc(100vh - 164px)',
    display : 'flex',
    alignItems : 'center',
    justifyContent : 'center'
}
function InDevelopment() {
    return (
        <div style={style}>
            <h2 style={{color: 'tomato'}}>Messages App is in Development</h2>
        </div>
    )
}

export default InDevelopment
