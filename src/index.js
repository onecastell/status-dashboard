import ForceGraph3D from '3d-force-graph'

// API Server entries
const servers = [
    { id: 'facebook', uri: 'https://www.facebook.com/platform/api-status/' },
    { id: 'twitter', uri: 'https://api.twitterstat.us/api/v2/status.json' },
    // {id: '', uri: ''},
]

const dataSource = {
    //  Define nodes array
    nodes: [...servers.keys()].map(n => ({ id: n, group: 2 })),
    //  Define links array
    links: [...servers.keys()].map(id => ({ source: id, target: 0 }))
}

const pointsGraph = ForceGraph3D()
    (document.body).graphData(dataSource)

// Ping each server
for (let server of servers) {
    fetch('https://cors-anywhere.herokuapp.com/'.concat(server.uri))
        .then(r => r.json())
        .then(d => {
            switch (server.id) {
                case 'facebook':
                    d.current.health === 1
                        ? dataSource.nodes[0].color = '#0f0'
                        : dataSource.nodes[0].color = '#f00'
                    break
                case 'twitter':
                    d.status.indicator === 'none'
                        ? dataSource.nodes[1].color = '#0f0'
                        : dataSource.nodes[1].color = '#f00'
                    break
            }
            pointsGraph.nodeRelSize(4) // Update Graph
        })
}
