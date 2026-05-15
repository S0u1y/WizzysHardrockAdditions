ServerEvents.recipes(event => {
    event.remove({ output: 'supplementaries:fine_wood' })

    event.shaped(
        Item.of('supplementaries:fine_wood', 8), 
        [
            'LLL',
            'LWL',
            'LLL'
        ],
        {
            L: '#minecraft:logs',     
            W: '#forge:wax'     
        }
    )
})