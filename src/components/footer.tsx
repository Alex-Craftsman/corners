import { Button } from '~/components/ui/button';

export const Footer = () => {
  return (
    <footer className="bottom-2 w-full text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()}{' '}
      <Button variant="link" className="p-0" asChild>
        <a href="https://github.com/Alex-Craftsman">Alex Craftsman</a>
      </Button>
    </footer>
  );
};
