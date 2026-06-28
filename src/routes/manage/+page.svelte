<script lang="ts">
	import { formatDate } from '$lib/utils/formatDate';
	import { SvelteMap } from 'svelte/reactivity';
	import type { PageData } from './$types';
	import type { RegistrationData } from '$lib/types';
	let { data }: { data: PageData } = $props();
	const openMap = new SvelteMap<number, boolean>();
	const dataMap = new SvelteMap<number, RegistrationData[]>();

	async function handleOpen(courseId: number, isOpen: boolean) {
		openMap.set(courseId, isOpen);
		if (!dataMap.get(courseId)) {
			const response = await fetch(`/api/manage/participants/${courseId}`, {
				method: 'GET',
				headers: {
					Accept: 'application/json'
				}
			});
			const body = (await response.json()) as RegistrationData[];
			dataMap.set(courseId, body);
		}
	}
</script>

<h1 class="text-4xl text-center mb-4 mt-4">Kursadmin</h1>

<div class="flex flex-col gap-3">
	{#each data.allCourses as c (c.id)}
		{@const participants = dataMap.get(c.id)}
		<div class="collapse collapse-arrow bg-base-100 border border-base-300">
			<input
				type="checkbox"
				value={c.id}
				onchange={(e) => handleOpen(c.id, e.currentTarget.checked)}
			/>
			<div class="collapse-title font-semibold">
				{formatDate(c.startDate)} – {formatDate(c.endDate)}
			</div>
			<div class="collapse-content text-sm text-center">
				{#if participants}
					<div class="overflow-x-auto rounded-box border border-base-content/5 bg-gray-800">
						<table class="table">
							<thead>
								<tr>
									<th>Navn</th>
									<th>E-post</th>
									<th>Telefon</th>
									<th class="text-center">Depositum</th>
									<th class="text-center">Kursavgift</th>
								</tr>
							</thead>
							<tbody>
								{#each participants as p (p.email)}
									<tr>
										<td>{p.givenName} {p.familyName}</td>
										<td>{p.email}</td>
										<td>{p.phone}</td>
										<td class="text-center">✅</td>
										<td class="text-center">❌</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else}
					<span class="text-center loading">&nbsp;</span>
				{/if}
			</div>
		</div>
	{/each}

	<!-- --
	<form>
		<button class="btn btn-primary">Legg til kurs</button>
	</form>
	-->
</div>
