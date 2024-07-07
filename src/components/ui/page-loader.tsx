import { LoaderIcon } from 'lucide-react';

const PageLoader = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <LoaderIcon className="animate-spin" />
    </div>
  );
};

export default PageLoader;
