class ImageInfo {
    #pixels = [];
    #width = 0;
    #height = 0;
    #image;

    constructor(pix, w, h, img) {
        this.width = w;
        this.height = h;
        this.pixels = pix;
        this.image = img;
    };

    get Width() {
        return this.width;
    };

    get Height() {
        return this.height;
    };

    get Pixels() {
        return this.pixels;
    };

    get IsReady() {
        return this.ready;
    }

    get Source() {
        return this.image;
    }
}

class Drawable {
    #obj_indices = [];
    #obj_vertices = [];
    #obj_uv = [];
    #vertexBuffer;
    #uvBuffer;
    #indexBuffer;
    texture
    img_inf = new ImageInfo(null, 0, 0);

    constructor(context, vertices, indices, uv) {
        this.obj_vertices = vertices;
        this.obj_indices = indices;
        this.obj_uv = uv;
        this.vertexBuffer = context.createBuffer();
        this.uvBuffer = context.createBuffer();
        this.indexBuffer = context.createBuffer();
        this.texture = context.createTexture();
    };

    loadTextures(context, textures) {
        for (var i = 0; i < textures.length; i++)
        {
            var image = new Image();
            LoadImage(textures[i], function(err, image, target) {
                let canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                let canvas_context = canvas.getContext('2d');
                canvas_context.drawImage(image, 0, 0);
                context.bindTexture(context.TEXTURE_2D, target.texture);
                context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, true);
                context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, image);
                target.img_inf = new ImageInfo(new Uint8Array(canvas_context.getImageData(0, 0, image.width, image.height).data.buffer), image.width, image.height, image);
            }, this);
        }
    };

    async drawObject(context, program) {
        if (this.img_inf.Pixels != null)
        {
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
        
            context.bindTexture(context.TEXTURE_2D, this.texture);
            context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, true);
            context.texSubImage2D(context.TEXTURE_2D, 0, 0, 0, this.img_inf.Width, this.img_inf.Height, context.RGBA, context.UNSIGNED_BYTE, this.img_inf.Pixels);
            context.generateMipmap(context.TEXTURE_2D);
    
            context.drawElements(context.TRIANGLES, this.obj_indices.length, context.UNSIGNED_SHORT, 0);
            //context.drawArrays(context.TRIANGLES, 0, this.obj_indices.length);
            context.bindBuffer(context.ARRAY_BUFFER, null);
            context.bindTexture(context.TEXTURE_2D, null);
            context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, null);   
        }
 
    };
};