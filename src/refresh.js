const cdn = "https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.5.3/socket.io.min.js";

function start_autorefresh(){
    
    const autorefresh_socket = new io('https://localhost:port');

    autorefresh_socket.on('error', (err) => {
        console.error(err);
    })
    
    autorefresh_socket.on('refresh', () => {
        document.location.reload();
    });

}

function load_script(){
    
    const scriptTag = document.createElement('script');

    scriptTag.setAttribute('src', cdn);
    scriptTag.setAttribute('type', 'module');

    document.body.appendChild(scriptTag);

    scriptTag.addEventListener('load', () => {
        start_autorefresh();
    })

}

fetch(cdn, {
    method : 'GET'
})
.then(resp => resp.text())
.then(data => {
    load_script();
})
.catch(err => {
    console.error(err)
})