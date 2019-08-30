import ForceGraph3D from '3d-force-graph'
import SpriteText from 'three-spritetext'
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
library.add(fab)
dom.i2svg()
dom.watch()

// API Server entries
const servers = [
    { label: 'facebook', uri: 'https://www.facebook.com/platform/api-status/', color: '#1877f2' },
    { label: 'twitter', uri: 'https://api.twitterstat.us/api/v2/status.json', color: '#1da1f2' },
    { label: 'github', uri: 'https://www.githubstatus.com/api/v2/status.json', color: '#222222' },
    { label: 'reddit', uri: 'https://reddit.statuspage.io/api/v2/status.json', color: '#ff4500' },
    { label: 'dropbox', uri: 'https://status.dropbox.com/api/v2/status.json', color: '#0061FF' },
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
    .nodeThreeObject(node => {
        const text = new SpriteText(String(node.label).toUpperCase())
        text.color = '#15151599'
        text.fontFace = 'Teko'
        text.textHeight = 3.5
        text.position.x = -(text._text.length * 1.75)
        return text
    })
    .nodeResolution(16)
    .linkDirectionalParticles(d => Math.floor(Math.random() * 7))
    .linkDirectionalParticleSpeed(.005)
    .graphData(dataSource)

// Rotate Camera
// setTimeout(() => {
//     let angle = 0;
//     setInterval(() => {
//         // Rotate camera
//         graph.cameraPosition({
//             x: 100 * Math.sin(angle),
//             z: 100 * Math.cos(angle)
//         });
//         angle += Math.PI / 5000;
//     }, 10);
// }, 600);

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

// Add Overlay
const overlay = document.createElement('main')
document.body.appendChild(overlay)

// Populate Overlay
for (let [index, server] of servers.entries()) {
    const button = document.createElement('button')
    button.title = server.label
    button.style.color = server.color

    const icon = document.createElement('i')
    icon.className = 'fab fa-' + server.label
    icon.style = "filter:drop-shadow(0 0 5px " + server.color + ")"

    button.appendChild(icon)
    button.addEventListener('click', event => {
        const node = dataSource.nodes[index]
        graph.cameraPosition({
            x: node.x,
            y: node.y,
            z: node.z + 50
        }, node, 2000);
    })
    overlay.appendChild(button)
}
