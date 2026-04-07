import { NotationParser } from '../src/utils/parser';

describe('NotationParser', () => {
	beforeEach(() => {
		NotationParser.clearCache();
	});

	test('parses NPC tags correctly', () => {
		const content = '[N:Jonah|friendly|wounded]';
		const result = NotationParser.parse(content);
		expect(result.npcs.has('Jonah')).toBe(true);
		expect(result.npcs.get('Jonah')?.tags).toEqual(['friendly', 'wounded']);
	});

	test('handles multiple NPC mentions and merges tags', () => {
		const content = `
			[N:Jonah|friendly]
			Some text
			[N:Jonah|wounded]
		`;
		const result = NotationParser.parse(content);
		expect(result.npcs.get('Jonah')?.tags).toContain('friendly');
		expect(result.npcs.get('Jonah')?.tags).toContain('wounded');
		expect(result.npcs.get('Jonah')?.mentions).toHaveLength(2);
	});

	test('parses location tags correctly', () => {
		const content = '[L:Lighthouse|ruined]';
		const result = NotationParser.parse(content);
		expect(result.locations.has('Lighthouse')).toBe(true);
		expect(result.locations.get('Lighthouse')?.tags).toEqual(['ruined']);
	});

	test('parses thread tags and updates state', () => {
		const content = `
			[Thread:Find Sister|Open]
			...
			[Thread:Find Sister|Closed]
		`;
		const result = NotationParser.parse(content);
		expect(result.threads.get('Find Sister')?.state).toBe('Closed');
	});

	test('parses progress elements (clocks, tracks, timers)', () => {
		const content = `
			[E:Alert 2/6]
			[Track:Investigation 4/10]
			[Timer:Dawn 3]
		`;
		const result = NotationParser.parse(content);
		
		const clock = result.progress.find(p => p.type === 'clock');
		expect(clock?.name).toBe('Alert');
		expect(clock?.current).toBe(2);
		expect(clock?.max).toBe(6);

		const track = result.progress.find(p => p.type === 'track');
		expect(track?.name).toBe('Investigation');
		expect(track?.current).toBe(4);
		expect(track?.max).toBe(10);

		const timer = result.progress.find(p => p.type === 'timer');
		expect(timer?.name).toBe('Dawn');
		expect(timer?.current).toBe(3);
	});
});
