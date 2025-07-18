import React from 'react';

interface IconProps {
  children: React.ReactNode;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ children, className = 'w-6 h-6' }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export const IconLibrary: { [key: string]: React.ReactNode } = {
    'default': (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="100%" height="100%">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.125 1.125 0 00-.928.928.143.048 1.125 1.125 0 00.928.928l.143.048a2.25 2.25 0 011.161.886l.51.766c.319.48.226 1.121-.216 1.49l-1.068.89a1.125 1.125 0 00-.405.864v.568m-1.5 0v-.568c0-.334-.148-.65-.405-.864l-1.068-.89a1.725 1.725 0 01-.216-1.49l.51-.766a2.25 2.25 0 00-1.161-.886l-.143-.048a1.125 1.125 0 01-.928-.928 1.125 1.125 0 01.928-.928l.143-.048a2.25 2.25 0 001.161-.886l-.51-.766a1.725 1.725 0 01.216-1.49l1.068-.89a1.125 1.125 0 00.405-.864v-.568a1.5 1.5 0 013 0z" />
        </svg>
    ),
    'baseball': (
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="100%" height="100%">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 19.5v-.75a7.5 7.5 0 00-7.5-7.5H5.25a7.5 7.5 0 00-7.5 7.5v.75m15-7.5a7.5 7.5 0 01-7.5 7.5H5.25a7.5 7.5 0 01-7.5-7.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    'pool': (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="100%" height="100%">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.277 8.12a.75.75 0 01.06-1.057 5.25 5.25 0 017.33 0 .75.75 0 01-1.117 1.002 3.75 3.75 0 00-5.225 0 .75.75 0 01-1.048.055zM12.75 12a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z" clipRule="evenodd" />
        </svg>
    ),
    'track': (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="100%" height="100%">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.792V6.31a2.25 2.25 0 00-2.25-2.25h-4.032M2.25 12.792V6.31a2.25 2.25 0 012.25-2.25h4.032M2.25 12.792h4.032M21 12.792h-4.032M13.788 5.034a2.25 2.25 0 013.376 0l.162.162a2.25 2.25 0 010 3.376l-.162.162a2.25 2.25 0 01-3.376 0l-.162-.162a2.25 2.25 0 010-3.376l.162-.162zM6.84 5.034a2.25 2.25 0 013.376 0l.162.162a2.25 2.25 0 010 3.376l-.162.162a2.25 2.25 0 01-3.376 0l-.162-.162a2.25 2.25 0 010-3.376l.162-.162z" />
        </svg>
    ),
    'weight-room': (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="100%" height="100%">
            <path d="M10 3a.75.75 0 01.75.75v1.5h4.25a.75.75 0 010 1.5H10.75v1.5a.75.75 0 01-1.5 0v-1.5H5a.75.75 0 010-1.5h4.25V3.75A.75.75 0 0110 3zM3.165 8.043a.75.75 0 01.24.53v.005l.004.024a10.93 10.93 0 01-1.292 4.416.75.75 0 01-1.48-.252 9.43 9.43 0 001.12-3.834.75.75 0 01.531-.724l.005-.002.024.004zm13.67 0a.75.75 0 01.531.724l.024-.005.005.002a.75.75 0 01.24-.53 9.43 9.43 0 001.12 3.834.75.75 0 11-1.48.252 10.93 10.93 0 01-1.292-4.416l.004-.024a.75.75 0 010-.005v-.005a.75.75 0 01.275-.53z" />
        </svg>
    ),
    'stadium': (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="100%" height="100%">
            <path fillRule="evenodd" d="M1.5 9.06a.75.75 0 01.75-.75h15a.75.75 0 010 1.5H2.25a.75.75 0 01-.75-.75zM1.5 5.06a.75.75 0 01.75-.75h15a.75.75 0 010 1.5H2.25a.75.75 0 01-.75-.75zM1.5 13.06a.75.75 0 01.75-.75h15a.75.75 0 010 1.5H2.25a.75.75 0 01-.75-.75z" clipRule="evenodd" />
        </svg>
    ),
    'gym': (
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="100%" height="100%">
             <path fillRule="evenodd" d="M14.5 1a.5.5 0 01.5.5v2.5a.5.5 0 01-.5.5h-3a.5.5 0 01-.5-.5v-1a.5.5 0 00-1 0v1a.5.5 0 01-.5.5h-3a.5.5 0 01-.5-.5V1.5a.5.5 0 01.5-.5h10zM5.5 16.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1a.5.5 0 001 0v-1a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v2.5a.5.5 0 01-.5.5h-10a.5.5 0 01-.5-.5v-2.5z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M7.103 4.002A3.5 3.5 0 0110 5.5h.01c1.83 0 3.333 1.43 3.493 3.243.16 1.813-1.28 3.34-3.003 3.5-1.9.17-3.5-1.417-3.5-3.333V9a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v.167a1.5 1.5 0 001.5 1.5h.167a1.5 1.5 0 001.5-1.5V9a.5.5 0 01.5-.5h.5a.5.5 0 01.5.5v.5a.5.5 0 01-.5.5h-1.5a.5.5 0 01-.5-.5V9c0-1.38-1.12-2.5-2.5-2.5H10a2.5 2.5 0 00-2.5 2.5v.492a.5.5 0 01-.97.224 3.5 3.5 0 01.573-4.186z" clipRule="evenodd" />
        </svg>
    ),
    'turf': (
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="100%" height="100%">
            <path d="M10 2a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 0110 2z" />
            <path fillRule="evenodd" d="M10 20a10 10 0 100-20 10 10 0 000 20zm-5.657-4.343a7.5 7.5 0 1011.314-11.314 7.5 7.5 0 00-11.314 11.314z" clipRule="evenodd" />
        </svg>
    )
};

interface BuildingIconProps {
  name: string;
  className?: string;
}

export const BuildingIcon: React.FC<BuildingIconProps> = ({ name, className = 'w-5 h-5' }) => {
  return (
    <Icon className={className}>
      {IconLibrary[name] || IconLibrary['default']}
    </Icon>
  );
};