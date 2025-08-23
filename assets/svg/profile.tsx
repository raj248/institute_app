import * as React from 'react';
import Svg, { SvgProps, Defs, ClipPath, Path, G } from 'react-native-svg';

interface IconProps extends SvgProps {
  focused?: boolean;
}

const HomeIcon = React.forwardRef<Svg, IconProps>(({ focused = false, ...props }, ref) => {
  return (
    <Svg width={1024} height={1024} viewBox="0 0 768 768" ref={ref} {...props}>
      <Defs>
        <ClipPath id="a">
          <Path d="M13.29 398h728.25v358H13.29Zm0 0" />
        </ClipPath>
        <ClipPath id="b">
          <Path d="M26.227 8.008h728.25v752.25H26.227Zm0 0" />
        </ClipPath>
        <ClipPath id="d">
          <Path d="M.45 390h728.027v358H.449Zm0 0" />
        </ClipPath>
        <ClipPath id="c">
          <Path d="M0 0h729v753H0z" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#a)">
        <Path
          d="M377.527 346.031c91.942 0 166.735-74.793 166.735-166.722 0-91.934-74.793-166.735-166.735-166.735-91.945 0-166.734 74.801-166.734 166.735 0 91.93 74.789 166.722 166.734 166.722Zm0-261.57c52.301 0 94.844 42.543 94.844 94.848 0 52.289-42.543 94.832-94.844 94.832-52.3 0-94.847-42.543-94.847-94.832 0-52.305 42.543-94.848 94.847-94.848Zm0 0"
          fill={focused ? '#3f3d91' : '#070101'}
          fillRule="nonzero"
        />
      </G>
      <G clipPath="url(#a)">
        <Path
          d="M563.45 398.367H191.601c-98.45 0-178.528 80.09-178.528 178.528 0 98.437 80.078 178.527 178.528 178.527h371.847c98.45 0 178.528-80.09 178.528-178.527 0-98.438-80.079-178.528-178.528-178.528Zm0 285.168H191.601c-58.805 0-106.637-47.844-106.637-106.64 0-58.797 47.832-106.641 106.637-106.641h371.847c58.809 0 106.64 47.844 106.64 106.64 0 58.797-47.831 106.641-106.64 106.641Zm0 0"
          fill={focused ? '#3f3d91' : '#070101'}
          fillRule="nonzero"
        />
      </G>
    </Svg>
  );
});

export default HomeIcon;
