<script>
    /** @type {import('./$types').PageData} */
    export let data;
    let fields = [];
    for (let field_name in data.collections) {
        let def = data.collections[field_name];
        if (def instanceof Array && def.length > 0) {
            def = def[0];
        }
        if (!def) {
            console.log(`No definition for ${field_name}`);
            console.log(data.collections[field_name]);
            continue;
        }
        const field = {
            name: field_name,
            link: def.link,
            map_to: def.map_to,
            justOne: def.justOne,
            type: def.type,
            index: def.index,
            unique: def.unique,
            required: def.required,
            default: def.default
        };
        // console.log({ field_name, def, field });
        fields.push(field);
    }
    // console.log(fields);
</script>

<h1>{data.name}</h1>

{#each fields as field}
    <p>{field.name}</p>
{/each}
