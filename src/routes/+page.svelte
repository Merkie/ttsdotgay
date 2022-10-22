<script lang="ts">
	export let data;
	const voices = data.voices;
	let selected_voice = '[Azure] en-US Jenny assistant';
	let text = '';

	const speak_text = async () => {
		const voice_object = voices.find((voice: { name: string }) => voice.name === selected_voice);
		const response = await fetch('/api/synthesize', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				provider: voice_object.provider.toLowerCase(),
				text: text || 'I think you forgot to put in some text, how about you try again?',
				voice: voice_object.data,
				name: voice_object.name
			})
		});

		const audio = await response.text();
		if (!audio) alert('No audio returned');

		new Audio(audio).play();
	};
</script>

<main>
	<article>
		<div class="main-circle">
			<span>t</span>
			<span style="transform: rotate(51.4deg);">t</span>
			<span style="transform: rotate(102.8deg);">s</span>
			<span style="transform: rotate(154.2deg);">.</span>
			<span style="transform: rotate(205.6deg);">g</span>
			<span style="transform: rotate(257deg);">a</span>
			<span style="transform: rotate(308.4deg);">y</span>
		</div>
	</article>
	<article class="alt">
		<h1>Hey!</h1>
		<p>
			This is tts.gay, a central source for all of my projects' TTS requirements. These projects
			include FreeSpeech AAC, AACstories, and more. <a
				target="blank"
				href="https://github.com/merkie">You can find these projects on my github page.</a
			>
			If you're here to test these voices, you can do so by interacting with the gadget below.
		</p>
		<div class="gadget">
			<input bind:value={text} placeholder="what you want the computer to say" type="text" />
			<select bind:value={selected_voice}>
				{#each voices as voice}
					<option value={voice.name}>{voice.name}</option>
				{/each}
			</select>
			<button on:click={speak_text}>speak my text!!</button>
		</div>
	</article>
</main>

<style>
	.main-circle {
		position: absolute;
		top: 30%;
		left: 48%;
		transform: translate(-50%, -50%);
	}
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100vw;
	}
	article {
		width: calc(100vw - 110px);
		height: calc(100vh - 60px);
		position: relative;
		padding: 30px;
		padding-left: 80px;
	}
	.alt {
		color: var(--inch-worm);
		background-color: var(--purple-heart);
	}
	span {
		font-size: 5rem;
		height: 200px;
		position: absolute;
		width: 20px;
		left: 0;
		top: 0;
		transform-origin: bottom center;
		transition: all 0.1s ease;
		cursor: default;
		user-select: none;
	}
	span:hover {
		top: -40px;
		filter: drop-shadow(0px 40px 0.5rem rgba(35, 35, 35, 0.529));
	}
	h1 {
		font-size: 8rem;
	}
	p {
		width: 90%;
		font-size: 2rem;
		text-align: right;
	}
	.gadget {
		width: 80%;
		margin: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 5px;
		margin-top: 100px;
	}
	.gadget * {
		width: 100%;
		background-color: var(--inch-worm);
		color: var(--purple-heart);
		border: 2px var(--inch-worm);
		padding: 5px;
		font-size: 2rem;
		padding: 10px 0px;
	}
	button {
		cursor: pointer;
	}
	a {
		color: inherit !important;
	}

	@media (max-width: 800px) {
		.alt {
			padding-bottom: 400px;
		}
		.gadget {
			margin-left: -10px;
			width: 93%;
		}
	}

	@media (max-width: 600px) {
		p {
			width: 80%;
		}
		.gadget {
			width: 90%;
		}
		.alt {
			padding-bottom: 600px;
		}
	}
</style>
