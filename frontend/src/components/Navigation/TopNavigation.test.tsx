import { render, screen } from "@testing-library/react";

describe("TopNavigation", () => {
    it("renders headline", () => {
        function Test({ title }: { title: string }) {
            return <div>{title}</div>;
        }
        render(<Test title="React" />);

        expect(screen.getByText("React")).toBeInTheDocument();
    });
});
