import ForceGraph3D from '3d-force-graph'
import SpriteText from 'three-spritetext'
// API Server entries
const servers = [
    { label: 'facebook', uri: 'https://www.facebook.com/platform/api-status/' },
    { label: 'twitter', uri: 'https://api.twitterstat.us/api/v2/status.json' },
    { label: 'github', uri: 'https://www.githubstatus.com/api/v2/status.json' },
    { label: 'reddit', uri: 'https://reddit.statuspage.io/api/v2/status.json' },
    { label: 'dropbox', uri: 'https://status.dropbox.com/api/v2/status.json' },
]

const dataSource = {
    //  Define nodes
    nodes: [...servers.keys()].map(n => ({ id: n, label: servers[n].label })),
    //  Define links 
    links: [...servers.keys()].map(id => ({ source: id, target: 0 }))
}

const graph = ForceGraph3D()
    (document.body)
    .backgroundColor('#f5f5f5')
    .showNavInfo(false)
    .cameraPosition({ z: 100 }, null, 500)
    .nodeThreeObjectExtend(true)
    .nodeThreeObject(node=>{
        const text = new SpriteText(node.label)
        text.color = '#15151599'
        text.textHeight = 3.5
        text.position.x = -(text._text.length * 1.75)
        return text
    })
    .nodeResolution(16)
    .linkDirectionalParticles(d => Math.floor(Math.random() * 7))
    .linkDirectionalParticleSpeed(.005)
    .graphData(dataSource)

setTimeout(() => {
    let angle = 0;
    setInterval(() => {
        // Rotate camera
        graph.cameraPosition({
            x: 100 * Math.sin(angle),
            z: 100 * Math.cos(angle)
        });
        angle += Math.PI / 5000;
    }, 10);
}, 600);

// Ping each server
for (let [index, server] of servers.entries()) {
    fetch('https://cors-anywhere.herokuapp.com/' + server.uri)
        .then(r => r.json())
        .then(d => {
            switch (server.label) {
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
            graph.nodeRelSize(4) // Update Graph
        })
}
