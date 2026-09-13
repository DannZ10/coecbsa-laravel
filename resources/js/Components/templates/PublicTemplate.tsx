import { type ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';
import { usePathname } from '@/lib/navigation';
import { ScrollProgress } from '@/Components/atoms/ScrollProgress';
import { Navbar } from '@/Components/organisms/Navbar';
import { Footer } from '@/Components/organisms/Footer';

export function PublicTemplate({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    return (
        <MotionConfig reducedMotion="user">
            <ScrollProgress />
            <Navbar />
            <main id="main-content" tabIndex={-1}>
                <div key={pathname}>{children}</div>
            </main>
            <Footer />
        </MotionConfig>
    );
}
