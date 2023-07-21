import { InputGroup, Form, Button } from 'react-bootstrap';

export default function SearchInput({ searchInput, setSearchInput }: { searchInput: string, setSearchInput: (searchInput: string) => void }) {
  return (
    <InputGroup className="mb-3 flex-nowrap" style={{ width: '20rem' }}>
      <Form.Control
        placeholder="Title"
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
      />

      <Button variant="secondary">
        <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8.671.025C3.89.025 0 3.915 0 8.696c0 4.782 3.89 8.672 8.671 8.672 1.462 0 2.9-.347 4.113-1.016.098.117.205.225.322.322l2.478 2.478a2.528 2.528 0 103.568-3.568l-2.478-2.478a2.473 2.473 0 00-.396-.322c.669-1.214 1.09-2.626 1.09-4.113C17.368 3.89 13.478 0 8.696 0l-.024.025zm0 2.477a6.165 6.165 0 016.194 6.194c0 1.636-.594 3.147-1.635 4.262l-.074.074a2.488 2.488 0 00-.322.322c-1.09.991-2.577 1.561-4.187 1.561a6.165 6.165 0 01-6.194-6.194 6.165 6.165 0 016.194-6.194l.024-.025z"
            fill="#6D1CFF"
          />
        </svg>
      </Button>
    </InputGroup>
  );
}






