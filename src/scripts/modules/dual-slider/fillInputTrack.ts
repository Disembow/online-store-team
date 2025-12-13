export default function fillInputTrack(track: HTMLElement, min: number, max: number): void {
  track.style.background = `linear-gradient(to right, transparent ${min}%, #6A983C ${min}%, #6A983C ${max}%, transparent ${max}%)`;
}
