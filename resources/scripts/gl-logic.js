"use strict";

var vertexShader;
    
var fragmentShader;
    
let canvas;
let gl;
let program;
let objects = [];
    
var init_page = function()
{    
    canvas = document.getElementById("surface");
    gl = canvas.getContext("webgl");
    program = gl.createProgram();

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

    load_shader(program, 'default');
    load_model('assets\\Box\\cube.json', ['assets\\Box\\dirty_crate_texture.png']);
    load_model('assets\\Toy\\toy.json', ['assets\\Toy\\toy_Col.png']); 
    for (var i = 0; i < 5; i++)
    {
        load_model('assets\\Star\\star.json', ['assets\\Star\\star_Col.png']);
        objects[objects.length - 1].setColor(GetRandom(0, 1), GetRandom(0, 1), GetRandom(0, 1));
    }


    requestAnimationFrame(draw_frame);
};

function draw_frame()
{
    gl.viewport(0, 0, innerWidth, innerHeight);
    gl.clearColor(0, 0, 0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for (var i = 0; i < objects.length; i ++)
    {    
        var identMat = new Float32Array(16);
        glMatrix.mat4.identity(identMat);
        var uboWorldLoc = gl.getUniformLocation(program, "mWorld");
        var frame = performance.now() / 1000 / 1 / 2 * Math.PI;

        switch (i)
        {
            case 0:
                glMatrix.mat4.rotate(objects[i].UBO[0], identMat, frame, [0, 1, 0]);
                var translation = glMatrix.vec3.create();
                glMatrix.vec3.set(translation, 0, i * 1.0, -2.0);
                glMatrix.mat4.translate(objects[i].UBO[0], objects[i].UBO[0], translation);
                break;
            case 1:
                glMatrix.mat4.rotate(objects[i].UBO[0], identMat, frame, [0, 1, 0]);
                var translation = glMatrix.vec3.create();
                glMatrix.vec3.set(translation, 0, i * 1.0, -2.0);
                glMatrix.mat4.translate(objects[i].UBO[0], objects[i].UBO[0], translation);
                break;
            default:
                glMatrix.mat4.rotate(objects[i].UBO[0], objects[i].UBO[0], Math.random() / 10, [0, 1, 0]);
                break;
        }



        gl.uniformMatrix4fv(uboWorldLoc, gl.FALSE, objects[i].UBO[0]);

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

function load_shader(program, name)
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

    var drawable = new Drawable(gl, program, boxVertices, boxIndices, uvCoordinates);
    drawable.loadTextures(gl, textures);
    objects.push(drawable);
};

function GetRandom(min, max) {
    return Math.random() * (max - min) + min;
  };