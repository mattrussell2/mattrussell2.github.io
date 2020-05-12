import {
	Uniform
} from '../../../src/Three';

export const MergeShader: {
	uniforms: {
		tDiffuse: Uniform;
		opacity: Uniform;
		mixRatio: Uniform;
		resolution: Uniform;
		edgeColor: Uniform;
	};
	vertexShader: string;
	fragmentShader: string;
};
