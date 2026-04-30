import './test.css'
import type { TestStatus } from '../../../../types'

type TestProps = {
  handleTest: (e: React.FormEvent<HTMLFormElement>) => void
  testStatus: TestStatus | undefined
  username: string | undefined
}

export default function Test({ handleTest, testStatus, username }: TestProps) {
  if (testStatus === 'failed') {
    return (
      <p className='step-finished'>Sorry — your answers didn't pass the test. Thanks for applying! You can close this window.</p>
    )
  }

  if (testStatus === 'passed') {
    return (
      <p className='step-finished'>Congratulations, You passed! You can close this window and move on to the next step</p>
    )
  }

  return (
    <div id="test-container">
      <div id="test-form">
        <div id="form-title">
          <p className="data-form-title">Test</p>
        </div>
        <div>
          <form onSubmit={handleTest}>
            <div id="test-body">
              <div id="col-one">
                <div className="form-group test-form-group">
                  <p className='q-question'>1) What is your name?</p>
                  <div className='question-group'>
                    <label>
                      <input type="radio" name="q1" value='a' required /> <p className='q-item'>{username}</p>
                    </label>
                    <label>
                      <input type="radio" name="q1" value='b' /> <p className='q-item'>Borbobulus Lemura</p>
                    </label>
                    <label>
                      <input type="radio" name="q1" value='c' /> <p className='q-item'>Zyg Xolthar</p>
                    </label>
                    <label>
                      <input type="radio" name="q1" value='d' /> <p className='q-item'>Lendalpher Higgs</p>
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <p className='q-question'>2) What is king Artur's quest?</p>
                  <div className='question-group'>
                    <label>
                      <input type="radio" name="q2" value='a' required /> <p className='q-item'>Party at Camelot</p>
                    </label>
                    <label>
                      <input type="radio" name="q2" value='b' /> <p className='q-item'>Seek the holy grail</p>
                    </label>
                    <label>
                      <input type="radio" name="q2" value='c' /> <p className='q-item'>Defeat the Bridge Knight</p>
                    </label>
                    <label>
                      <input type="radio" name="q2" value='d' /> <p className='q-item'>Defeat the french</p>
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <p className='q-question'>3) What is the colour of the sky?</p>
                  <div className='question-group'>
                    <label>
                      <input type="radio" name="q3" value='a' required /> <p className='q-item'>Black</p>
                    </label>
                    <label>
                      <input type="radio" name="q3" value='b' /> <p className='q-item'>Grey</p>
                    </label>
                    <label>
                      <input type="radio" name="q3" value='c' /> <p className='q-item'>Blue</p>
                    </label>
                    <label>
                      <input type="radio" name="q3" value='d' /> <p className='q-item'>Orange</p>
                    </label>
                  </div>
                </div>
              </div>
              <div id="col-two">
                <div className="form-group">
                  <p className='q-question'>4) What is the Capital of Assyria?</p>
                  <div className='question-group'>
                    <label>
                      <input type="radio" name="q4" value='a' required /> <p className='q-item'>Assur</p>
                    </label>
                    <label>
                      <input type="radio" name="q4" value='b' /> <p className='q-item'>Nimrud</p>
                    </label>
                    <label>
                      <input type="radio" name="q4" value='c' /> <p className='q-item'>Nineveh</p>
                    </label>
                    <label>
                      <input type="radio" name="q4" value='d' /> <p className='q-item'>Harran</p>
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <p className='q-question'>5) What is the airspeed velocity of an unladen swallow?</p>
                  <div className='question-group'>
                    <label>
                      <input type="radio" name="q5" value='a' required /> <p className='q-item'>22 km/h</p>
                    </label>
                    <label>
                      <input type="radio" name="q5" value='b' /> <p className='q-item'>33 km/h</p>
                    </label>
                    <label>
                      <input type="radio" name="q5" value='c' /> <p className='q-item'>55 km/h</p>
                    </label>
                    <label>
                      <input type="radio" name="q5" value='d' /> <p className='q-item'>Which kind of swallow: african or european?</p>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <input type="submit" name="test-submit" id="test-submit" value="submit" />
          </form>
        </div>
      </div>
    </div>
  )
}
