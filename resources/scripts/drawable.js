class Drawable {
    #obj_indices = [];
    #obj_vertices = [];
    #obj_uv = [];
    #obj_textures = [];
    #vertexBuffer;
    #uvBuffer;
    #indexBuffer;
    #texure;
    
    constructor(context, vertices, indices, uv) {
        this.obj_vertices = vertices;
        this.obj_indices = indices;
        this.obj_uv = uv;
        this.vertexBuffer = context.createBuffer();
        this.uvBuffer = context.createBuffer();
        this.indexBuffer = context.createBuffer();
        this.texture = context.createTexture();
    };

    setTextures(textures) {
        for (var i = 0; i < textures.length; i++)
        {
            var image = new Image();
            image.src = textures[i];
            this.#obj_textures.push(image);
        }
    };

    async drawObject(context, program) {
        context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        context.bufferData(context.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.obj_indices), context.STATIC_DRAW);

        context.bindBuffer(context.ARRAY_BUFFER, this.vertexBuffer);
        context.bufferData(context.ARRAY_BUFFER, new Float32Array(this.obj_vertices), context.STATIC_DRAW);
        var posAtt = context.getAttribLocation(program, "vecPos");
        context.vertexAttribPointer(posAtt, 3, context.FLOAT, context.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
        context.enableVertexAttribArray(posAtt);
    
        context.bindBuffer(context.ARRAY_BUFFER, this.uvBuffer);
        context.bufferData(context.ARRAY_BUFFER, new Float32Array(this.obj_uv), context.STATIC_DRAW);
        var uvAtt = context.getAttribLocation(program, "vert_uv");
        context.vertexAttribPointer(uvAtt, 2, context.FLOAT, context.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
        context.enableVertexAttribArray(uvAtt);
    
        for (var i = 0; i < this.#obj_textures.length; i++)
        {
            context.bindTexture(context.TEXTURE_2D, this.texture);
            context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, true);
            context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, this.#obj_textures[i]);
            context.generateMipmap(context.TEXTURE_2D);
        }

        context.drawElements(context.TRIANGLES, this.obj_indices.length, context.UNSIGNED_SHORT, 0);
        context.bindBuffer(context.ARRAY_BUFFER, null);
        context.bindTexture(context.TEXTURE_2D, null);
        context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, null);    
    };
};