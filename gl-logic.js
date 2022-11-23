var vertexShader = [
"attribute vec3 vecPos;",
"attribute vec3 vecColor;",
"varying vec3 fragColor;",
"uniform mat4 mWorld;",
"uniform mat4 mProj;",
"uniform mat4 mView;",
"void main() {",
"fragColor = vecColor;",
"gl_Position = mProj * mView * mWorld * vec4(vecPos, 1.0);",
"}"
].join('\n');

var fragmentShader = [
"precision mediump float;",
"varying vec3 fragColor;",
"void main() {",
"gl_FragColor = vec4(fragColor, 1.0);",
"}"
].join('\n');

let canvas;
let gl;

var init_page = function()
{
    console.log("start");

    canvas = document.getElementById("surface");
    gl = canvas.getContext("webgl");
    if (!gl)
    {
        console.log("Your browser doesn't support webgl");
    }

    canvas.width = innerWidth;
    canvas.height = innerHeight;
    gl.viewport(0, 0, innerWidth, innerHeight);

    gl.clearColor(0.28, 0, 0.98, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    var vert = gl.createShader(gl.VERTEX_SHADER);
    var frag = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vert, vertexShader);
    gl.shaderSource(frag, fragmentShader);
    compile_shader(vert);
    compile_shader(frag);

    var program = gl.createProgram();
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program)

	var boxVertices = 
	[ // X, Y, Z           R, G, B
		// Top
		-1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
		-1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
		1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
		1.0, 1.0, -1.0,    0.5, 0.5, 0.5,

		// Left
		-1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
		-1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
		-1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
		-1.0, 1.0, -1.0,   0.75, 0.25, 0.5,

		// Right
		1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
		1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
		1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
		1.0, 1.0, -1.0,   0.25, 0.25, 0.75,

		// Front
		1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
		1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, 1.0, 1.0,    1.0, 0.0, 0.15,

		// Back
		1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
		1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, 1.0, -1.0,    0.0, 1.0, 0.15,

		// Bottom
		-1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
		-1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
		1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
		1.0, -1.0, -1.0,    0.5, 0.5, 1.0,
	];

	var boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
	];

    var vertexBuffer = gl.createBuffer();
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);


    var posAtt = gl.getAttribLocation(program, "vecPos");
    var colAtt = gl.getAttribLocation(program, "vecColor");
    gl.vertexAttribPointer(posAtt, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 0 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(posAtt);
    gl.vertexAttribPointer(colAtt, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(colAtt);


    var uboWorldLoc = gl.getUniformLocation(program, "mWorld");
    var uboProjLoc = gl.getUniformLocation(program, "mProj");
    var uboViewLoc = gl.getUniformLocation(program, "mView");

    var worldMat = new Float32Array(16);
    var projMat = new Float32Array(16);
    var viewjMat = new Float32Array(16);

    glMatrix.mat4.identity(worldMat);
    glMatrix.mat4.lookAt(viewjMat, [0, 0, -5], [0, 0, 0], [0, 1, 0]);
    glMatrix.mat4.perspective(projMat, 60 * Math.PI / 180,innerWidth/innerHeight, 0.1, 100);
    gl.useProgram(program);

    gl.uniformMatrix4fv(uboWorldLoc, gl.FALSE, worldMat);
    gl.uniformMatrix4fv(uboProjLoc, gl.FALSE, projMat);
    gl.uniformMatrix4fv(uboViewLoc, gl.FALSE, viewjMat);

    var frame = 0;
    var identMat = new Float32Array(16);
    glMatrix.mat4.identity(identMat);
    var loop = function() {
        frame = performance.now() / 1000 / 1 / 2 * Math.PI;
        glMatrix.mat4.rotate(worldMat, identMat, frame, [0, 1, 1]);
        gl.uniformMatrix4fv(uboWorldLoc, gl.FALSE, worldMat);

        gl.clearColor(0.28, 0, 0.98, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
        requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
}

function compile_shader(shader)
{
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        console.log("Error compiling a shader", gl.getShaderInfoLog(shader));
    }
}