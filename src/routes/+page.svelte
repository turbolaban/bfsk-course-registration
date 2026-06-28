<script lang="ts">
	import type { PageData } from './$types';
	import { formatDate } from '$lib/utils/formatDate';

	// Receive the data returned by the +page.server.ts load function
	let { data }: { data: PageData } = $props();

	let loading = $state(false);
	let selectedCourseId: number | undefined = $derived(data.upcomingCourses?.[0]?.id);
	let selectedCourse = $derived(data.upcomingCourses.find((c) => c.id === selectedCourseId));
	let isStudent = $state('no');

	let paymentType = $state('deposit');

	async function handleRegistration(event: Event) {
		event.preventDefault();
		loading = true;

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		const data: { [key: string]: unknown } = {};
		for (const [key, value] of formData.entries()) {
			if (key === 'student') {
				data['isStudent'] = value === 'yes';
			} else {
				data[key] = value;
			}
		}

		console.log(formData, data);

		// 1. Call your SvelteKit backend endpoint
		const response = await fetch('/api/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		const { url, error } = await response.json();

		if (error) {
			alert(`Checkout failed: ${error}`);
			loading = false;
			return;
		}

		// 2. Redirect the user to Stripe's highly secure checkout page
		if (url) {
			window.location.href = url;
		}
	}
</script>

<h1 class="text-4xl text-center mb-4 mt-4">
	Påmelding til fallskjermkurs - Bergen fallskjermklubb
</h1>

{#if data.upcomingCourses.length === 0}
	<p>Ingen tilgjengelige datoer</p>
{:else}
	<form class="flex flex-col gap-4 max-w-300" onsubmit={handleRegistration}>
		<div class="card bg-base-100 shadow-sm">
			<div class="card-body">
				<h2 class="card-title">Velg kursdato</h2>
				<input type="hidden" name="courseId" value={selectedCourseId} />
				<ul class="list gap-3">
					{#each data.upcomingCourses as c (c.id)}
						<li>
							<button
								type="button"
								class="flex place-items-center list-row cursor-pointer w-full border bg-gray-700"
								class:border-amber-400={selectedCourseId === c.id}
								class:border-gray-700={selectedCourseId !== c.id}
								class:hover:border-amber-100={selectedCourseId !== c.id}
								onclick={() => {
									selectedCourseId = c.id;
								}}
							>
								<div class="grow text-left">
									{formatDate(c.startDate)} – {formatDate(c.endDate)}
								</div>
								<div class="text-green-600 text-right">Ledige plasser</div>
							</button>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<div class="card bg-base-100 shadow-sm">
			<div class="card-body">
				<h2 class="card-title">Deltakerinformasjon</h2>
				<div class="flex flex-col gap-2" onsubmit={handleRegistration}>
					<input class="input w-full" type="text" name="givenName" placeholder="Fornavn" required />
					<input
						class="input w-full"
						type="text"
						name="familyName"
						placeholder="Etternavn"
						required
					/>
					<input class="input w-full" type="email" name="email" placeholder="E-post" required />
					<input class="input w-full" type="tel" name="phone" placeholder="Telefon" required />
					<label class="label">
						<p>Student / skoleelev / vernepliktig</p>
						<select class="select" name="student" bind:value={isStudent}>
							<option value="no">Nei</option>
							<option value="yes">Ja</option>
						</select>
					</label>
				</div>
			</div>
		</div>

		<div class="card bg-base-100 shadow-sm">
			<div class="card-body">
				<h2 class="card-title">Betaling</h2>
				<input type="hidden" name="paymentType" value={paymentType} />
				{#if selectedCourse}
					<ul class="list gap-2">
						<li>
							<button
								type="button"
								class="flex place-items-center list-row cursor-pointer bg-gray-700 w-full border"
								class:border-amber-400={paymentType === 'deposit'}
								class:border-gray-700={paymentType !== 'deposit'}
								class:hover:border-amber-100={paymentType !== 'deposit'}
								onclick={() => {
									paymentType = 'deposit';
								}}
							>
								<div class="grow text-left">
									<p class="text-lg">Kun depositum</p>
									<p class="text-sm text-gray-400">Resterende betales innen kursstart</p>
								</div>
								<div class="text-right text-nowrap">3000,-</div>
							</button>
						</li>
						<li>
							<button
								type="button"
								class="flex place-items-center list-row cursor-pointer bg-gray-700 w-full border"
								class:border-amber-400={paymentType === 'full'}
								class:border-gray-700={paymentType !== 'full'}
								class:hover:border-amber-100={paymentType !== 'full'}
								onclick={() => {
									paymentType = 'full';
								}}
							>
								<div class="grow text-left">
									<p class="text-lg">Hele kursavgiften</p>
									<p class="text-sm text-gray-400">Depositum, kr 3000, refunders ikke</p>
								</div>
								<div class="text-right text-nowrap">
									{#if isStudent === 'no'}
										9000,-
									{:else}
										8500,-
									{/if}
								</div>
							</button>
						</li>
					</ul>
					<button type="submit" class="btn btn-primary mt-6" disabled={loading}
						>Meld på og betal <span class:loading></span></button
					>
				{:else}
					<p>Velg ønsket kursdato først</p>
				{/if}
			</div>
		</div>
	</form>
{/if}
