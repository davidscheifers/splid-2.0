import { App } from 'aws-cdk-lib';
import { SplidStack } from '../../lib/infrastructure-stack';
import environmentConfig from '../../bin/stack-config';

describe('SplidStack Snapshot', () => {
    test('should match the snapshot', () => {
        const app = new App();
        const stack = new SplidStack(app, 'TestSplidStack', environmentConfig);
        
        const synthesizedStack = JSON.stringify(app.synth().getStackArtifact(stack.artifactId).template, null, 2);
        
        expect(synthesizedStack).toMatchSnapshot();
    });
});
