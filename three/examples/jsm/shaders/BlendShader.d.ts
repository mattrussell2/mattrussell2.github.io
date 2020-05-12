import {
	Uniform
} from '../../../src/Three';

export const BlendShader: {
	uniforms: {
		tDiffuse: Uniform;
		tDiffuse1: Uniform;
		mixRatio: Uniform;
		opacity: Uniform;
	};
	vertexShader: string;
	fragmentShader: string;
};
