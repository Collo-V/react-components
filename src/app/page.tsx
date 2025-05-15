import Link from "next/link";

export default function Home() {
  return (
    <div className="section crc-py-4">
      <h1 className={'crc-text-6'}>Get Started With Collov React Components</h1>
      <ol  className="crc-list-number crc-grid crc-gap-4">
        <li>
          <h5>Install Components</h5>
          <p className={'crc-mt-4'}>
            npm i collov-react-components
          </p>
        </li>
        <li>
          <h5>import css</h5>
          <p className={'crc-mt-4'}>
            import {`'collov-react-components/css'`}
          </p>
        </li>
        <li>
          <h5>Start Using components!</h5>
          <p className={'crc-mt-4'}>
            import {`{QuillText} from  'collov-react-components'`}
          </p>
        </li>
      </ol>
      <div className={'crc-mt-10'}>
        <Link href="/components" className={'text-primary'}>
          Check Components
        </Link>
      </div>

    </div>
  );
}
