import ForceGraph3D from '3d-force-graph'

// API Server entries
const servers = [
    { id: 'facebook', uri: 'https://www.facebook.com/platform/api-status/' },
    { id: 'twitter', uri: 'https://api.twitterstat.us/api/v2/status.json' },
    { id: 'github', uri: 'https://www.githubstatus.com/api/v2/status.json' },
    { id: 'reddit', uri: 'https://reddit.statuspage.io/api/v2/status.json' },
    { id: 'dropbox', uri: 'https://status.dropbox.com/api/v2/status.json' },
    // { id: 'reddit', uri: '' },
]


const dataSource = {
    //  Define nodes
    nodes: [...servers.keys()].map(n => ({ id: n, group: 2 })),
    //  Define links 
    links: [...servers.keys()].map(id => ({ source: id, target: 0 }))
}

const pointsGraph = ForceGraph3D()
    (document.body)
    .backgroundColor('#f5f5f5')
    .showNavInfo(false)
    .cameraPosition({ z: 100 }, null, 500)
    .linkDirectionalParticles(d => Math.floor(Math.random() * 7))
    .linkDirectionalParticleSpeed(.005)
    .graphData(dataSource)

setTimeout(() => {
    let angle = 0;
    setInterval(() => {
        // Rotate camera
        pointsGraph.cameraPosition({
            x: 100 * Math.sin(angle),
            z: 100 * Math.cos(angle)
        });
        angle += Math.PI / 5000;
    }, 10);
}, 600);

// Ping each server
for (let [index, server] of servers.entries()) {
    // console.log(server, index)
    fetch('https://cors-anywhere.herokuapp.com/'.concat(server.uri))
        .then(r => r.json())
        .then(d => {
            switch (server.id) {
                case 'facebook':
                    d.current.health === 1
                        ? dataSource.nodes[index].color = '#0f0'
                        : dataSource.nodes[index].color = '#f00'
                    break
                case 'dropbox':
                case 'github':
                case 'reddit':
                case 'twitter':
                    d.status.indicator === 'none'
                        ? dataSource.nodes[index].color = '#0f0'
                        : dataSource.nodes[index].color = '#f00'
                    break
            }
            pointsGraph.nodeRelSize(4) // Update Graph
        })
}
