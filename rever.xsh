from rever.activity import activity

try:
  input("Are you sure you are on the master branch which is identical to origin/master? [ENTER]")
except KeyboardInterrupt:
  sys.exit(1)

@activity
def publish():
  cd vue-remote-component
  yarn
  yarn build
  yarn publish --new-version $VERSION
  cd ..

$PROJECT = 'vue-remote-component'

$ACTIVITIES = [
    'version_bump',
    'changelog',
    'tag',
    'push_tag',
    'ghrelease',
    'publish',
]

$VERSION_BUMP_PATTERNS = [
    ('vue-remote-component/package.json', r'"version":', r'  "version": "$VERSION",'),
]

$CHANGELOG_FILENAME = 'ChangeLog'
$CHANGELOG_TEMPLATE = 'TEMPLATE.rst'
$CHANGELOG_NEWS = 'news'
$CHANGELOG_CATEGORIES = ('Added', 'Changed', 'Removed', 'Fixed')
$PUSH_TAG_REMOTE = 'git@github.com:saraedum/vue-remote-component.git'

$GITHUB_ORG = 'saraedum'
$GITHUB_REPO = 'vue-remote-component'
