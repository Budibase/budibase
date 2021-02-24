<script>
    import ForceGraph3D from "3d-force-graph"
    import { getContext } from "svelte"
  
    const { styleable, API } = getContext("sdk")
    const component = getContext("component")
  
    // datasource
    export let nodes
    export let links
    // settings
    export let backgroundColor = "#000011"
    export let width = "100%"
    export let height = "100%"
    export let showNavInfo = true
  
    let threedGraph
  
    // fake data
    // const NODES = 50
    // const GROUPS = 12
    // const fakeData = {
    //   nodes: [...Array(NODES).keys()].map(i => ({
    //     id: i,
    //     group: Math.ceil(Math.random() * GROUPS),
    //     name: "FakeNodeName",
    //     // img: "",
    //   })),
    //   links: [...Array(NODES).keys()]
    //     .filter(id => id)
    //     .map(id => ({
    //       source: id,
    //       target: Math.round(Math.random() * (id - 1)),
    //       value: Math.round(Math.random() * (id - 1)),
    //       group: Math.ceil(Math.random() * GROUPS),
    //     })),
    // }
  
    const display = async () => {
      const highlightNodes = new Set()
      const highlightLinks = new Set()
      let hoverNode = null
  
      const getData = async () => ({
        nodes: await API.fetchDatasource(nodes),
        links: await API.fetchDatasource(links),
      })
  
      const data = await getData()
  
      // data preprocess
      data.links.forEach(link => {
        const a = data.nodes[link.source]
        const b = data.nodes[link.target]
        !a.neighbors && (a.neighbors = [])
        !b.neighbors && (b.neighbors = [])
        a.neighbors.push(b)
        b.neighbors.push(a)
  
        !a.links && (a.links = [])
        !b.links && (b.links = [])
        a.links.push(link)
        b.links.push(link)
      })
  
      const updateHighlight = () => {
        // trigger update of highlighted objects in scene
        Graph.nodeColor(Graph.nodeColor())
          .linkWidth(Graph.linkWidth())
          .linkDirectionalParticles(Graph.linkDirectionalParticles())
      }
  
      const Graph = ForceGraph3D()(threedGraph)
        .graphData(data)
        .showNavInfo(showNavInfo)
        .linkWidth(link => (highlightLinks.has(link) ? 4 : 1))
        .nodeAutoColorBy("group")
        .width(width)
        .height(height)
        .linkAutoColorBy(link => link.group)
        .linkDirectionalParticles("value")
        .backgroundColor(backgroundColor)
        .linkDirectionalParticleSpeed(d => d.value * 0.001)
        .linkDirectionalParticleWidth(1)
        .linkDirectionalArrowLength(3.5)
        .linkDirectionalArrowRelPos(1)
        .linkCurvature(0.25)
        .onNodeHover(node => {
          // no state change
          if ((!node && !highlightNodes.size) || (node && hoverNode === node))
            return
  
          highlightNodes.clear()
          highlightLinks.clear()
          if (node) {
            highlightNodes.add(node)
            node.neighbors.forEach(neighbor => highlightNodes.add(neighbor))
            node.links.forEach(link => highlightLinks.add(link))
          }
  
          hoverNode = node || null
  
          updateHighlight()
        })
        .onLinkHover(link => {
          highlightNodes.clear()
          highlightLinks.clear()
  
          if (link) {
            highlightLinks.add(link)
            highlightNodes.add(link.source)
            highlightNodes.add(link.target)
          }
  
          updateHighlight()
        })
        .onNodeClick(node => {
          // Aim at node from outside it
          const distance = 65
          const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z)
  
          Graph.cameraPosition(
            {
              x: node.x * distRatio,
              y: node.y * distRatio,
              z: node.z * distRatio,
            }, // new position
            node, // lookAt ({ x, y, z })
            3000 // ms transition duration
          )
        })
    }
  </script>
  
  {#if nodes}
    <div use:styleable={$component.styles} bind:this={threedGraph} use:display />
  {:else}
    <div use:styleable={$component.styles}>
      Use the settings panel to build your chart -->
    </div>
  {/if}
   
