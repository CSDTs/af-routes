import React, { useState } from "react";

const TimeSlotSelector = ({ timeSlots, onSelect }) => {
	const [selectedSlots, setSelectedSlots] = useState([]);

	const handleSelect = (slot) => {
		const isSlotSelected = selectedSlots.includes(slot);

		if (isSlotSelected) {
			setSelectedSlots(selectedSlots.filter((s) => s !== slot));
		} else {
			setSelectedSlots([...selectedSlots, slot]);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSelect(selectedSlots);
	};

	return (
		<form onSubmit={handleSubmit}>
			{timeSlots.map((slot) => (
				<label key={slot}>
					<input
						type="checkbox"
						value={slot}
						checked={selectedSlots.includes(slot)}
						onChange={() => handleSelect(slot)}
					/>
					{slot}
				</label>
			))}
			<button type="submit">Submit</button>
		</form>
	);
};

export default TimeSlotSelector;
