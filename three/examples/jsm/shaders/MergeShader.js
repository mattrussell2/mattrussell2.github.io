/**
 * @author matt russell - based on copyshader example.
 *
 * Full-screen textured quad shader
 */

 import {
 	Vector2,
	Vector3
 } from "../../../build/three.module.js";


var MergeShader = {

	uniforms: {
		"tDiffuse": { value: null },
		"opacity": { value: 1.0 },
		"resolution": { value: new Vector2() },
    "mixRatio": { value: 0.5 },
    "edgeColor": { value: new Vector3() }
	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

		"	vUv = uv;",
		"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [
		"#include <common>",

		"uniform float opacity;",
		"uniform vec2 resolution;",
    "uniform vec3 edgeColor;",
    "uniform float mixRatio;",
		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",

		"	vec4 texel = texture2D( tDiffuse, vUv );",
		" vec3 color = texel.rgb;",

    // we can just do the linearToRelativeLuminance calculation for each nearby
    // pixel at each pixel - obviously this is not efficient, but it doesn't
    // seem to cause any problems re: smoothness at this point.
		"	//float l = linearToRelativeLuminance( texel.rgb );",
		"	//vec4 wbColor = vec4( l, l, l, texel.w );",

		"	vec2 tex = vec2( 1.0 / resolution.x, 1.0 / resolution.y );",

		// kernel definition (in glsl matrices are filled in column-major order)

		"	const mat3 Gx = mat3( -1, -2, -1, 0, 0, 0, 1, 2, 1 );", // x direction kernel
		"	const mat3 Gy = mat3( -1, 0, 1, -2, 0, 2, -1, 0, 1 );", // y direction kernel

		// fetch the 3x3 neighbourhood of a fragment

		// first column
		"	float tx0y0 = linearToRelativeLuminance(texture2D( tDiffuse, vUv + tex * vec2( -1, -1 ) ).rgb);",
		"	float tx0y1 = linearToRelativeLuminance(texture2D( tDiffuse, vUv + tex * vec2( -1,  0 ) ).rgb);",
		"	float tx0y2 = linearToRelativeLuminance(texture2D( tDiffuse, vUv + tex * vec2( -1,  1 ) ).rgb);",

		// second column
		"	float tx1y0 = linearToRelativeLuminance(texture2D( tDiffuse, vUv + tex * vec2(  0, -1 ) ).rgb);",
		"	float tx1y1 = linearToRelativeLuminance(texture2D( tDiffuse, vUv + tex * vec2(  0,  0 ) ).rgb);",
		"	float tx1y2 = linearToRelativeLuminance(texture2D( tDiffuse, vUv + tex * vec2(  0,  1 ) ).rgb);",

		// third column
		"	float tx2y0 = linearToRelativeLuminance(texture2D( tDiffuse, vUv + tex * vec2(  1, -1 ) ).rgb);",
		"	float tx2y1 = linearToRelativeLuminance(texture2D( tDiffuse, vUv + tex * vec2(  1,  0 ) ).rgb);",
		"	float tx2y2 = linearToRelativeLuminance(texture2D( tDiffuse, vUv + tex * vec2(  1,  1 ) ).rgb);",

		// gradient value in x direction
		"	float valueGx = Gx[0][0] * tx0y0 + Gx[1][0] * tx1y0 + Gx[2][0] * tx2y0 + ",
		"		Gx[0][1] * tx0y1 + Gx[1][1] * tx1y1 + Gx[2][1] * tx2y1 + ",
		"		Gx[0][2] * tx0y2 + Gx[1][2] * tx1y2 + Gx[2][2] * tx2y2; ",

		// gradient value in y direction
		"	float valueGy = Gy[0][0] * tx0y0 + Gy[1][0] * tx1y0 + Gy[2][0] * tx2y0 + ",
		"		Gy[0][1] * tx0y1 + Gy[1][1] * tx1y1 + Gy[2][1] * tx2y1 + ",
		"		Gy[0][2] * tx0y2 + Gy[1][2] * tx1y2 + Gy[2][2] * tx2y2; ",

		// magnitute of the total gradient
		"	float G = sqrt( ( valueGx * valueGx ) + ( valueGy * valueGy ) );",

		"	vec4 sColor = vec4( G * edgeColor, 1 );",

		" //gl_FragColor = texel;",
		" gl_FragColor = (1.0 - mixRatio) * texel + mixRatio * sColor;",

		"}"

	].join( "\n" )

};

export { MergeShader };
