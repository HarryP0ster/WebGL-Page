"use strict";

var vertexShader;
    
var fragmentShader;
    
let canvas;
let gl;
let program;
let uniformBuffer = [];
let objects = [];
    
var init_page = function()
{    
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
    
    uniformBuffer.push(new Float32Array(16));
    uniformBuffer.push(new Float32Array(16));
    uniformBuffer.push(new Float32Array(16));
    uniformBuffer.push(new Float32Array(16));
    uniformBuffer.push(new Float32Array(16));
    uniformBuffer.push(new Float32Array(16));

    load_shader('default');
    load_model('assets\\Box\\cube.json', ['assets\\Box\\dirty_crate_texture.png']);
    load_model('assets\\Toy\\toy.json', ['assets\\Toy\\toy_Col.png']);  

    requestAnimationFrame(draw_frame);
};

function draw_frame()
{
    gl.viewport(0, 0, innerWidth, innerHeight);
    gl.clearColor(0, 0, 0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for (var i = 0; i < objects.length; i ++)
    {        
        setup_ubo_matrices();

        var identMat = new Float32Array(16);
        glMatrix.mat4.identity(identMat);
        var uboWorldLoc = gl.getUniformLocation(program, "mWorld");
        var frame = performance.now() / 1000 / 1 / 2 * Math.PI;
        glMatrix.mat4.rotate(uniformBuffer[0 + 3*i], identMat, frame, [0, 1, 0]);
        var translation = glMatrix.vec3.create();
        glMatrix.vec3.set(translation, 0, i * 1.0, -2.0);
        glMatrix.mat4.translate(uniformBuffer[0 + 3*i], uniformBuffer[0 + 3*i], translation);
        gl.uniformMatrix4fv(uboWorldLoc, gl.FALSE, uniformBuffer[0 + 3*i]);

        objects[i].drawObject(gl, program);
    }
    
    requestAnimationFrame(draw_frame);
};
    
function compile_shader(shader)
{
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        console.log("Error compiling a shader", gl.getShaderInfoLog(shader));
    }
};

function setup_ubo_matrices()
{
    for (var i = 0; i < 2; i++)
    {
        var uboWorldLoc = gl.getUniformLocation(program, "mWorld");
        var uboProjLoc = gl.getUniformLocation(program, "mProj");
        var uboViewLoc = gl.getUniformLocation(program, "mView");
        
        glMatrix.mat4.identity(uniformBuffer[0 + 3*i]);
        glMatrix.mat4.perspective(uniformBuffer[1 + 3*i], 60 * Math.PI / 180,innerWidth/innerHeight, 0.1, 100);
        glMatrix.mat4.lookAt(uniformBuffer[2 + 3*i], [4, 2, 3], [0, 0.35, 0], [0, 1, 0]);
    
        gl.uniformMatrix4fv(uboWorldLoc, gl.FALSE, uniformBuffer[0 + 3*i]);
        gl.uniformMatrix4fv(uboProjLoc, gl.FALSE, uniformBuffer[1 + 3*i]);
        gl.uniformMatrix4fv(uboViewLoc, gl.FALSE, uniformBuffer[2 + 3*i]);
    }
};

function load_shader(name)
{
    var vert = gl.createShader(gl.VERTEX_SHADER);
    var frag = gl.createShader(gl.FRAGMENT_SHADER);
    LoadText("shaders\\" + name + ".vert", function(err,res) {
        vertexShader = res;
    });
    LoadText("shaders\\" + name + ".frag", function(err, res) {
        fragmentShader = res;
    })

    gl.shaderSource(vert, vertexShader);
    gl.shaderSource(frag, fragmentShader);
    compile_shader(vert);
    compile_shader(frag);
    
    program = gl.createProgram();
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    gl.useProgram(program);
};

async function load_model(url, textures)
{
    var obj;
    LoadJSON(url, function(err, res) {
        obj = res;
    });
        
    var boxVertices = [];
    for (var i = 0; i < obj['meshes'].length; i++)
    {
        boxVertices = boxVertices.concat.apply(boxVertices, obj['meshes'][i]['vertices']);
    }

    var boxIndices = [];
    for (var i = 0; i < obj['meshes'].length; i++)
    {
        boxIndices = boxIndices.concat.apply(boxIndices, obj['meshes'][i]['faces']);
    }

    var uvCoordinates = [];
    for (var i = 0; i < obj['meshes'].length; i++)
    {
        uvCoordinates = uvCoordinates.concat.apply(uvCoordinates, obj['meshes'][i]['texturecoords']['0']);
    }
    
    var drawable = new Drawable(gl, boxVertices, boxIndices, uvCoordinates);
    drawable.loadTextures(gl, textures);
    objects.push(drawable);
};